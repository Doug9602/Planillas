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

# --- AGUINALDO (CORREGIDO) ---
def calcular_aguinaldo(sueldo_base, fecha_ingreso: date, fecha_corte: date) -> float:
    """
    Calcula el monto del aguinaldo basado en la antigüedad al 20 de octubre del año de la fecha de corte.
    Si tiene menos de un año, se paga proporcional a los meses completos.
    """
    # Fecha de referencia: 20 de octubre del año de fecha_corte
    fecha_ref = date(fecha_corte.year, 10, 20)
    
    # Si el empleado ingresó después del 20 de octubre, no tiene derecho en este período
    if fecha_ingreso > fecha_ref:
        return 0.0
    
    # Calcular años completos entre fecha_ingreso y fecha_ref
    años = calcular_anios(fecha_ingreso, fecha_ref)
    
    if años >= 1:
        # Usar tabla de días según años de servicio
        if años < 3:
            dias = 15
        elif años < 10:
            dias = 19
        else:
            dias = 21
    else:
        # Menos de un año: calcular proporcional por meses completos
        meses = (fecha_ref.year - fecha_ingreso.year) * 12 + (fecha_ref.month - fecha_ingreso.month)
        # Restar un mes si el día de ingreso es mayor que el día de referencia
        if fecha_ingreso.day > fecha_ref.day:
            meses -= 1
        if meses < 0:
            meses = 0
        # Días proporcionales: 15 días * (meses / 12)
        dias = (15 * meses) / 12
    
    # Calcular monto
    return (float(sueldo_base) / 30) * dias

# --- QUINCENA 25 ---
def calcular_quincena25(sueldo_base, aplica: bool) -> float:
    if aplica and float(sueldo_base) <= 1500:
        return float(sueldo_base) * 0.5
    return 0.0

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