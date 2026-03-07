import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-socio-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socio-edit.component.html',
  styleUrl: './socio-edit.component.css',
})
export class SocioEditComponent implements OnInit {
  socioForm!: FormGroup;
  cargandoData = false;
  esEdicion = false;
  socioId?: number;

  // Listas para selects (reemplazar con datos de servicios)
  cajas = [
    { id: 1, nombre: 'Caja Médica' },
    { id: 2, nombre: 'Caja Previsión' },
  ];
  estados = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.socioId = this.route.snapshot.params['id'];
    if (this.socioId) {
      this.esEdicion = true;
      this.cargarDatosSocio(this.socioId);
    }
  }

  createForm() {
    this.socioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      numeroSocio: [null, Validators.required],
      numeroBeneficio: [null],
      correoElectronico: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      caja: this.fb.group({ id: [null, Validators.required] }),
      estado: this.fb.group({ id: [null, Validators.required] }),
      direccion: this.fb.group({
        calle: ['', Validators.required],
        numero: ['', Validators.required],
        piso: [''],
        departamento: [''],
        barrio: ['', Validators.required],
        ciudad: ['', Validators.required],
      }),
      telefonos: this.fb.array([]),
    });
  }

  get telefonos(): FormArray {
    return this.socioForm.get('telefonos') as FormArray;
  }

  agregarTelefono(numero: string = '') {
    this.telefonos.push(
      this.fb.group({
        numero: [numero, Validators.required],
      }),
    );
  }

  removerTelefono(i: number) {
    this.telefonos.removeAt(i);
  }

  cargarDatosSocio(id: number) {
    this.cargandoData = true;
    // Simulación de llamada a API
    // this.socioService.getSocio(id).subscribe(socio => {
    //    this.socioForm.patchValue(socio);
    //    socio.telefonos.forEach(t => this.agregarTelefono(t.numero));
    //    this.cargandoData = false;
    // });
  }

  onSubmit() {
    if (this.socioForm.valid) {
      console.log('Actualizando socio:', this.socioForm.value);
      // Lógica para PUT/PATCH
    }
  }

  cancelar() {
    this.router.navigate(['/socios']);
  }
}
