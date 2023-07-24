import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsManagerComponent } from './stats-manager.component';

describe('StatsManagerComponent', () => {
  let component: StatsManagerComponent;
  let fixture: ComponentFixture<StatsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
