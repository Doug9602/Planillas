from datetime import date

# --- CONSTANTES ---
HORA_EXTRA_DIURNA_FACTOR = 2.0
HORA_EXTRA_NOCTURNA_FACTOR = 2.5
ISSS_EMPLEADO_PCT = 0.03
ISSS_PATRONAL_PCT = 0.075
AFP_EMPLEADO_PCT = 0.0725
AFP_PATRONAL_PCT = 0.0875
TOPE_ISSS = 1000.0

TRAMOS_ISR = [
    (0.01, 550.00, 0.00, 0.00),
    (550.01, 895.24, 17.67, 0.10),
    (895.25, 2038.10, 60.00, 0.20),
    (2038.11, float('inf'), 288.57, 0.30)
]

# --- UTILIDADES ---
def calcular_anios(fecha_ingreso: date, fecha_corte: date) -> int:
    años = fecha_corte.year - fecha_ingreso.year
    if (fecha_corte.month < fecha_ingreso.month) or \
       (fecha_corte.month == fecha_ingreso.month and fecha_corte.day < fecha_ingreso.day):
        años -= 1
    return años

# --- HORAS ---
def calcular_valor_hora(sueldo_base) -> float:
    return float(sueldo_base) / 30 / 8

def calcular_horas_extras_diurnas(horas, valor_hora) -> float:
    return float(horas) * float(valor_hora) * HORA_EXTRA_DIURNA_FACTOR

def calcular_horas_extras_nocturnas(horas, valor_hora) -> float:
    return float(horas) * float(valor_hora) * HORA_EXTRA_NOCTURNA_FACTOR

# --- VACACIONES ---
def calcular_monto_vacaciones(sueldo_base, fecha_ingreso: date, fecha_corte: date) -> float:
    if fecha_corte.month == fecha_ingreso.month:
        años = calcular_anios(fecha_ingreso, fecha_corte)
        if años >= 1:
            return (float(sueldo_base) / 2) * 0.30
    return 0.0

# --- AGUINALDO ---
def calcular_aguinaldo(sueldo_base, fecha_ingreso: date, fecha_corte: date) -> float:
    """
    Calcula el monto del aguinaldo basado en la antigüedad al 20 de octubre del año de la fecha de corte.
    Si tiene menos de un año, se paga proporcional a los meses completos.
    """
    fecha_ref = date(fecha_corte.year, 10, 20)
    
    if fecha_ingreso > fecha_ref:
        return 0.0
    
    años = calcular_anios(fecha_ingreso, fecha_ref)
    
    if años >= 1:
        if años < 3:
            dias = 15
        elif años < 10:
            dias = 19
        else:
            dias = 21
    else:
        meses = (fecha_ref.year - fecha_ingreso.year) * 12 + (fecha_ref.month - fecha_ingreso.month)
        if fecha_ingreso.day > fecha_ref.day:
            meses -= 1
        if meses < 0:
            meses = 0
        dias = (15 * meses) / 12
    
    return (float(sueldo_base) / 30) * dias

# --- QUINCENA 25 (CORREGIDA) ---
def calcular_quincena25(sueldo_base, aplica: bool, fecha_ingreso: date, fecha_corte: date) -> float:
    """
    Calcula el monto de la Quincena 25 de forma proporcional.
    - Solo aplica si el sueldo base es <= $1,500.
    - Solo aplica si el año de fecha_corte es >= 2026.
    - El período de cómputo es del 15 de enero del año anterior al 15 de enero del año de fecha_corte.
    - Si el empleado ingresó antes del 15 de enero del año anterior → 12 meses completos (pago completo).
    - Si ingresó durante el año, se calculan los meses completos trabajados hasta el 15 de enero del año de corte.
    - Se usa la regla del día 15: si ingresa después del día 15 de un mes, ese mes no se cuenta.
    """
    if not aplica:
        return 0.0
    if float(sueldo_base) > 1500:
        return 0.0
    if fecha_corte.year < 2026:
        return 0.0

    fecha_limite = date(fecha_corte.year, 1, 15)  # 15 de enero del año de la fecha de corte

    # Si ingresó después del 15 de enero del año de corte → no tiene derecho
    if fecha_ingreso > fecha_limite:
        return 0.0

    # Inicio del período: 15 de enero del año anterior
    fecha_inicio_periodo = date(fecha_corte.year - 1, 1, 15)

    if fecha_ingreso <= fecha_inicio_periodo:
        meses_laborados = 12
    else:
        # Calcular meses completos entre fecha_ingreso y fecha_limite
        años_diff = fecha_limite.year - fecha_ingreso.year
        meses_diff = fecha_limite.month - fecha_ingreso.month
        # Ajuste por día 15
        if fecha_ingreso.day > 15:
            meses_diff -= 1
        meses_laborados = años_diff * 12 + meses_diff
        if meses_laborados < 0:
            meses_laborados = 0

    factor = meses_laborados / 12
    return (float(sueldo_base) / 2) * factor

# --- DEDUCCIONES ---
def calcular_isss(monto_cotizable) -> float:
    base = min(float(monto_cotizable), TOPE_ISSS)
    return base * ISSS_EMPLEADO_PCT

def calcular_afp(monto_cotizable) -> float:
    return float(monto_cotizable) * AFP_EMPLEADO_PCT

def calcular_isr(base_imponible) -> float:
    base_imponible = float(base_imponible)
    for desde, hasta, cuota, porcentaje in TRAMOS_ISR:
        if desde <= base_imponible <= hasta:
            excedente = base_imponible - desde
            return cuota + (excedente * porcentaje)
    return 0.0