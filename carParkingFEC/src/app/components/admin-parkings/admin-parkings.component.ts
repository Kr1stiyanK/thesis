import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, ParkingAdmin, CreateParkingRequest } from '../../service/data.service';
import {ActivatedRoute} from "@angular/router";

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
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadParkings();
  }

  startEdit(parking: ParkingAdmin): void {
    this.editing = parking;

    this.parkingForm.patchValue({
      name: parking.name,
      city: parking.city,
      address: parking.address,
      contactPhone: parking.contactPhone ?? '',
      spacesCount: parking.spacesCount,
      pricePerHourBgn: parking.pricePerHourBgn,
      cardPaymentEnabled: parking.cardPaymentEnabled,
      open24Hours: parking.open24Hours,
      openingTime: parking.open24Hours ? '' : (parking.openingTime ?? ''),
      closingTime: parking.open24Hours ? '' : (parking.closingTime ?? ''),
      loyaltyEnabled: parking.loyaltyEnabled,
      loyaltyVisitPerPoint: parking.loyaltyVisitPerPoint ?? null,
      loyaltyPointsRequired: parking.loyaltyPointsRequired ?? null,
      loyaltyRewardHours: parking.loyaltyRewardHours ?? null,
      mapImageUrl: parking.mapImageUrl ?? ''
    });

    setTimeout(() => {
      const formEl = document.getElementById('parking-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }


  saveParking(): void {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const formValue = this.parkingForm.value;

    const req: CreateParkingRequest = {
      name: formValue.name,
      address: formValue.address,
      city: formValue.city,
      spacesCount: formValue.spacesCount,
      pricePerHourBgn: formValue.pricePerHourBgn,
      cardPaymentEnabled: formValue.cardPaymentEnabled,
      loyaltyEnabled: formValue.loyaltyEnabled,
      loyaltyVisitPerPoint: formValue.loyaltyVisitPerPoint,
      loyaltyPointsRequired: formValue.loyaltyPointsRequired,
      loyaltyRewardHours: formValue.loyaltyRewardHours,
      mapImageUrl: formValue.mapImageUrl,
      open24Hours: formValue.open24Hours,
      openingTime: formValue.open24Hours ? null : formValue.openingTime,
      closingTime: formValue.open24Hours ? null : formValue.closingTime,
      contactPhone: formValue.contactPhone || null
    };

    if (this.editing) {
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
      name: [''],
      city: [''],
      address: [''],
      contactPhone: [''],
      spacesCount: [0],
      pricePerHourBgn: [0],
      cardPaymentEnabled: [false],
      open24Hours: [false],
      openingTime: [''],
      closingTime: [''],
      loyaltyEnabled: [false],
      loyaltyVisitPerPoint: [''],
      loyaltyPointsRequired: [''],
      loyaltyRewardHours: [''],
      mapImageUrl: ['']
    }, {
      validators: this.workingHoursValidator
    });
  }

  private resetForm(): void {
    this.parkingForm.reset({
      name: '',
      city: '',
      address: '',
      contactPhone: '',
      spacesCount: 0,
      pricePerHourBgn: 0,
      cardPaymentEnabled: false,
      open24Hours: false,
      openingTime: '',
      closingTime: '',
      loyaltyEnabled: false,
      loyaltyVisitPerPoint: null,
      loyaltyPointsRequired: null,
      loyaltyRewardHours: null,
      mapImageUrl: ''
    });

    this.editing = null;
  }


  private loadParkings(): void {
    // this.loading = true;
    // this.dataService.getMyParkings().subscribe({
    //   next: (res) => {
    //     this.parkings = res;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error loading parkings', err);
    //     this.loading = false;
    //   }
    // });
    this.loading = true;

    this.dataService.getMyParkings().subscribe({
      next: (res) => {
        this.parkings = res;
        this.loading = false;

        const parkingIdParam = this.route.snapshot.queryParamMap.get('parkingId');
        if (parkingIdParam) {
          const id = Number(parkingIdParam);
          const selected = this.parkings.find(p => p.id === id);
          if (selected) {
            this.startEdit(selected);

            setTimeout(() => {
              const formEl = document.getElementById('parking-form');
              if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 0);
          }
        }
      },
      error: (err) => {
        console.error('Error loading parkings', err);
        this.loading = false;
      }
    });
  }

  private workingHoursValidator(form: FormGroup) {
    const open24 = form.get('open24Hours')?.value;
    const opening = form.get('openingTime')?.value;
    const closing = form.get('closingTime')?.value;

    if (open24) {
      return null;
    }

    if (!opening || !closing) {
      return { workingHours: true };
    }

    if (opening >= closing) {
      return { workingHoursInvalid: true };
    }

    return null;
  }


  priceInEur(priceBgn: number): number {
    return priceBgn / this.BGN_TO_EUR;
  }

  // createParking(): void {
  //   if (this.parkingForm.invalid) {
  //     this.parkingForm.markAllAsTouched();
  //     return;
  //   }
  //
  //   const req: CreateParkingRequest = this.parkingForm.value;
  //
  //   this.dataService.createParking(req).subscribe({
  //     next: (created) => {
  //       this.parkings.push(created);
  //       this.parkingForm.reset({
  //         spacesCount: 0,
  //         pricePerHourBgn: 0,
  //         cardPaymentEnabled: false,
  //         loyaltyEnabled: false,
  //         loyaltyVisitPerPoint: null,
  //         loyaltyPointsRequired: null,
  //         loyaltyRewardHours: null,
  //         mapImageUrl: ''
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Error creating parking', err);
  //     }
  //   });
  // }

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
    this.resetForm();
  }

}
