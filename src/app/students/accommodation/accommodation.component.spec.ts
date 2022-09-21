import { ComponentFixture, TestBed } from '@angular/core/testing';
import { accommodationComponent } from './accommodation.component';

describe('accommodationComponent', () => {
  let component: accommodationComponent;
  let fixture: ComponentFixture<accommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [accommodationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(accommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
