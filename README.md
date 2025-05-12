# SeguimientoYControlDePasantias
//codigo en python
class Pasante:
    def __init__(self, nombre, identificacion, empresa):
        self.nombre = nombre
        self.identificacion = identificacion
        self.empresa = empresa
        self.tutor = None
        self.evaluaciones = []

    def asignar_tutor(self, tutor):
        self.tutor = tutor

    def agregar_evaluacion(self, evaluacion):
        self.evaluaciones.append(evaluacion)

    def obtener_informacion(self):
        return {
            "Nombre": self.nombre,
            "ID": self.identificacion,
            "Empresa": self.empresa,
            "Tutor": self.tutor if self.tutor else "Sin asignar",
            "Evaluaciones": self.evaluaciones if self.evaluaciones else "Sin evaluaciones"
        }


class SistemaPasantias:
    def __init__(self):
        self.pasantes = []

    def registrar_pasante(self, nombre, identificacion, empresa):
        pasante = Pasante(nombre, identificacion, empresa)
        self.pasantes.append(pasante)
        print(f"Pasante {nombre} registrado exitosamente.")

    def asignar_tutor(self, identificacion, tutor):
        for pasante in self.pasantes:
            if pasante.identificacion == identificacion:
                pasante.asignar_tutor(tutor)
                print(f"Tutor {tutor} asignado a {pasante.nombre}.")
                return
        print("Pasante no encontrado.")

    def agregar_evaluacion(self, identificacion, evaluacion):
        for pasante in self.pasantes:
            if pasante.identificacion == identificacion:
                pasante.agregar_evaluacion(evaluacion)
                print(f"Evaluación agregada a {pasante.nombre}.")
                return
        print("Pasante no encontrado.")

    def buscar_pasante(self, identificacion):
        for pasante in self.pasantes:
            if pasante.identificacion == identificacion:
                return pasante.obtener_informacion()
        return "Pasante no encontrado."

    def eliminar_pasante(self, identificacion):
        for pasante in self.pasantes:
            if pasante.identificacion == identificacion:
                self.pasantes.remove(pasante)
                print(f"Pasante {pasante.nombre} eliminado del sistema.")
                return
        print("Pasante no encontrado.")

    def generar_reporte(self):
        print("\n===== Reporte General de Pasantes =====")
        if not self.pasantes:
            print("No hay pasantes registrados.")
            return

        for pasante in self.pasantes:
            info = pasante.obtener_informacion()
            print("\n--- Reporte de Pasante ---")
            for clave, valor in info.items():
                print(f"{clave}: {valor}")


# Ejemplo de uso
sistema = SistemaPasantias()

sistema.registrar_pasante("Juan Pérez", "1234", "Empresa X")
sistema.registrar_pasante("Ana Gómez", "5678", "Empresa Y")

sistema.asignar_tutor("1234", "Ing. Rodríguez")
sistema.asignar_tutor("5678", "Lic. Martínez")

sistema.agregar_evaluacion("1234", "Buen desempeño en tareas asignadas")
sistema.agregar_evaluacion("5678", "Necesita mejorar en puntualidad")

sistema.generar_reporte()
print(sistema.buscar_pasante("1234"))

sistema.eliminar_pasante("5678")
sistema.generar_reporte()
