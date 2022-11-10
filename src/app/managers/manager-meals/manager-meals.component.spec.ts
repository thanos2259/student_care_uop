import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerMealsComponent } from './manager-meals.component';

describe('ManagerMealsComponent', () => {
  let component: ManagerMealsComponent;
  let fixture: ComponentFixture<ManagerMealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerMealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerMealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
