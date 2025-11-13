import {Component, OnInit} from '@angular/core';
import {CreateParkingRequest, DataService, ParkingAdmin} from "../../service/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-admin-parking',
  standalone: true,
  imports: [],
  templateUrl: './admin-parking.component.html',
  styleUrl: './admin-parking.component.css'
})
export class AdminParkingComponent implements OnInit {

  myParkings: ParkingAdmin[] = [];
  loading = true;
  showCreateForm = false;

  parkingForm!: FormGroup;

  loyaltyOptions = [
    { value: 'ONE_HOUR', label: '1 час безплатен паркинг' },
    { value: 'THREE_HOURS', label: '3 часа безплатен паркинг' },
    { value: 'SIX_HOURS', label: '6 часа безплатен паркинг' },
    { value: 'EIGHT_HOURS', label: '8 часа безплатен паркинг' }
  ];

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMyParkings();
  }

  private initForm(): void {
    this.parkingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      spacesCount: [0, [Validators.required, Validators.min(1)]],
      pricePerHourBgn: [0, [Validators.required, Validators.min(0)]],
      cardPaymentEnabled: [false],
      loyaltyEnabled: [false],
      loyaltyVisitPerPoint: [1],
      loyaltyPointsRequired: [1],
      loyaltyRewardHours: ['ONE_HOUR'],
      mapImageUrl: ['']
    });

    // Когато чекбоксът за лоялност се променя – включваме/изключваме полетата
    this.parkingForm.get('loyaltyEnabled')!.valueChanges.subscribe(enabled => {
      const fields = ['loyaltyVisitPerPoint', 'loyaltyPointsRequired', 'loyaltyRewardHours'];
      fields.forEach(f => {
        const control = this.parkingForm.get(f)!;
        if (enabled) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      });
    });
  }

  private loadMyParkings(): void {
    this.dataService.getMyParkings().subscribe({
      next: parkings => {
        this.myParkings = parkings;
        this.loading = false;

        // Тук идва логиката: ако НЯМА паркинги → показваме форма
        this.showCreateForm = parkings.length === 0;
      },
      error: err => {
        console.error('Error loading my parkings', err);
        this.loading = false;
        this.showCreateForm = true; // да не блокираме admin-а
      }
    });
  }

  onSubmit(): void {
    if (this.parkingForm.invalid) {
      this.parkingForm.markAllAsTouched();
      return;
    }

    const value = this.parkingForm.value;

    const request: CreateParkingRequest = {
      name: value.name,
      address: value.address,
      spacesCount: value.spacesCount,
      pricePerHourBgn: value.pricePerHourBgn,
      cardPaymentEnabled: value.cardPaymentEnabled,
      loyaltyEnabled: value.loyaltyEnabled,
      loyaltyVisitPerPoint: value.loyaltyEnabled ? value.loyaltyVisitPerPoint : undefined,
      loyaltyPointsRequired: value.loyaltyEnabled ? value.loyaltyPointsRequired : undefined,
      loyaltyRewardHours: value.loyaltyEnabled ? value.loyaltyRewardHours : undefined,
      mapImageUrl: value.mapImageUrl
    };

    this.dataService.createParking(request).subscribe({
      next: created => {
        // За момента – просто показваме съобщение и скриваме формата
        alert('Паркингът е създаден успешно.');
        this.myParkings = [created];
        this.showCreateForm = false; // по задание: ако вече има → не показваме форма
      },
      error: err => {
        console.error('Error creating parking', err);
        alert('Възникна грешка при създаване на паркинг.');
      }
    });
  }
}
