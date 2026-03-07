import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SocioService } from '../services/socio.service';
import { Socio } from '../models/socio.model';

@Component({
  selector: 'app-socio-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './socio-view.component.html',
  styleUrl: './socio-view.component.css'
})
export class SocioViewComponent implements OnInit {
  socio?: Socio;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.socioService.getSocio(+id).subscribe({
        next: (data) => {
          this.socio = data;
          this.loading = false;
        },
        error: () => this.router.navigate(['/socios'])
      });
    }
  }

  volver(): void {
    this.router.navigate(['/socios']);
  }
}