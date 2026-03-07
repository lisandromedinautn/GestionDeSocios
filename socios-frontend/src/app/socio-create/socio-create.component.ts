import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs'; // Para manejar múltiples peticiones
import { SocioService } from '../services/socio.service';
import { CajaService } from '../services/caja.service';
import { EstadoService } from '../services/estado.service';

@Component({
  selector: 'app-socio-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './socio-create.component.html',
  styleUrls: ['./socio-create.component.css'],
})
export class SocioCreateComponent implements OnInit {
  socioForm!: FormGroup;
  
  // Arreglos dinámicos
  cajas: any[] = [];
  estados: any[] = [];
  cargandoData = true;

  constructor(
    private fb: FormBuilder,
    private socioService: SocioService,
    private cajaService: CajaService,    // Nuevo servicio
    private estadoService: EstadoService, // Nuevo servicio
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosMaestros();
  }

  private cargarDatosMaestros(): void {
    // Obtenemos cajas y estados simultáneamente
    forkJoin({
      cajas: this.cajaService.findAll(),
      estados: this.estadoService.findAll()
    }).subscribe({
      next: (res) => {
        this.cajas = res.cajas;
        this.estados = res.estados;
        this.cargandoData = false;
      },
      error: (err) => {
        console.error('Error al cargar datos maestros:', err);
        this.cargandoData = false;
      }
    });
  }

  private initForm(): void {
    this.socioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      dni: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      numeroBeneficio: [null, Validators.required],
      numeroSocio: [null, Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      fechaIngreso: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      fechaNacimiento: ['', Validators.required],

      direccion: this.fb.group({
        calle: ['', Validators.required],
        numero: ['', Validators.required],
        piso: [''],
        departamento: [''],
        barrio: ['', Validators.required],
        ciudad: ['', Validators.required],
      }),

      caja: this.fb.group({
        id: [null, Validators.required],
      }),
      estado: this.fb.group({
        id: [null, Validators.required],
      }),

      telefonos: this.fb.array([this.crearTelefonoFormGroup()]),
    });
  }

  get telefonos(): FormArray {
    return this.socioForm.get('telefonos') as FormArray;
  }

  crearTelefonoFormGroup(): FormGroup {
    return this.fb.group({
      numero: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  agregarTelefono(): void {
    this.telefonos.push(this.crearTelefonoFormGroup());
  }

  removerTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.socioForm.valid) {
      const payload = { ...this.socioForm.value };

      // Limpieza de campos opcionales de dirección
      if (payload.direccion) {
        if (!payload.direccion.piso) delete payload.direccion.piso;
        if (!payload.direccion.departamento) delete payload.direccion.departamento;
      }

      this.socioService.createSocio(payload).subscribe({
        next: () => {
          alert('Socio creado con éxito');
          this.router.navigate(['/socios']);
        },
        error: (err) => {
          console.error('Error al crear socio:', err);
          if (err.error && err.error.message) {
            alert('Error del servidor: ' + err.error.message);
          }
        },
      });
    } else {
      this.socioForm.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/socios']);
  }
}