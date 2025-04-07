import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainviewGlobalComponent } from './mainview-global.component';

describe('MainviewGlobalComponent', () => {
  let component: MainviewGlobalComponent;
  let fixture: ComponentFixture<MainviewGlobalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainviewGlobalComponent]
    });
    fixture = TestBed.createComponent(MainviewGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
