import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, ParkingAdmin, CreateParkingRequest } from '../../service/data.service';

@Component({
  selector: 'app-admin-parkings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-parkings.component.html',
  styleUrl: './admin-parkings.component.css'
})
export class AdminParkingsComponent implements OnInit {

  parkings: ParkingAdmin[] = [];
  parkingForm!: FormGroup;
  loading = false;

  editing: ParkingAdmin | null = null;

  readonly BGN_TO_EUR = 1.95583;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadParkings();
  }

  startEdit(parking: ParkingAdmin): void {
    this.editing = parking;

    this.parkingForm.patchValue({
      name: parking.name,
      address: parking.address,
      spacesCount: parking.spacesCount,
      pricePerHourBgn: parking.pricePerHourBgn,
      cardPaymentEnabled: parking.cardPaymentEnabled,
      loyaltyEnabled: parking.loyaltyEnabled,
      loyaltyVisitPerPoint: parking.loyaltyVisitPerPoint ?? null,
      loyaltyPointsRequired: parking.loyaltyPointsRequired ?? null,
      loyaltyRewardHours: parking.loyaltyRewardHours ?? null,
      mapImageUrl: parking.mapImageUrl ?? ''
    });
  }

  saveParking(): void {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const req: CreateParkingRequest = this.parkingForm.value;

    if (this.editing) {
      // UPDATE
      this.dataService.updateParking(this.editing.id, req).subscribe({
        next: (updated) => {
          const idx = this.parkings.findIndex(p => p.id === updated.id);
          if (idx !== -1) {
            this.parkings[idx] = updated;
          }
          this.editing = null;
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating parking', err);
        }
      });
    } else {
      // CREATE
      this.dataService.createParking(req).subscribe({
        next: (created) => {
          this.parkings.push(created);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error creating parking', err);
        }
      });
    }
  }

  private initForm(): void {
    this.parkingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      spacesCount: [0, [Validators.required, Validators.min(0)]],
      pricePerHourBgn: [0, [Validators.required, Validators.min(0)]],
      cardPaymentEnabled: [false],
      loyaltyEnabled: [false],
      loyaltyVisitPerPoint: [null],
      loyaltyPointsRequired: [null],
      loyaltyRewardHours: [null],
      mapImageUrl: ['']
    });
  }

  private resetForm(): void {
    this.parkingForm.reset({
      name: '',
      address: '',
      spacesCount: 0,
      pricePerHourBgn: 0,
      cardPaymentEnabled: false,
      loyaltyEnabled: false,
      loyaltyVisitPerPoint: null,
      loyaltyPointsRequired: null,
      loyaltyRewardHours: null,
      mapImageUrl: ''
    });
  }

  private loadParkings(): void {
    this.loading = true;
    this.dataService.getMyParkings().subscribe({
      next: (res) => {
        this.parkings = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading parkings', err);
        this.loading = false;
      }
    });
  }

  priceInEur(priceBgn: number): number {
    return priceBgn / this.BGN_TO_EUR;
  }

  createParking(): void {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const req: CreateParkingRequest = this.parkingForm.value;

    this.dataService.createParking(req).subscribe({
      next: (created) => {
        this.parkings.push(created);
        this.parkingForm.reset({
          spacesCount: 0,
          pricePerHourBgn: 0,
          cardPaymentEnabled: false,
          loyaltyEnabled: false,
          loyaltyVisitPerPoint: null,
          loyaltyPointsRequired: null,
          loyaltyRewardHours: null,
          mapImageUrl: ''
        });
      },
      error: (err) => {
        console.error('Error creating parking', err);
      }
    });
  }

  deleteParking(id: number): void {
    if (!confirm('Наистина ли искате да изтриете този паркинг?')) {
      return;
    }

    this.dataService.deleteParking(id).subscribe({
      next: () => {
        this.parkings = this.parkings.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error('Error deleting parking', err);
      }
    });
  }

  cancelEdit(): void {
    this.editing = null;
    this.resetForm();
  }

}
