import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionselectComponent } from './questionselect.component';

describe('QuestionselectComponent', () => {
  let component: QuestionselectComponent;
  let fixture: ComponentFixture<QuestionselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionselectComponent]
    });
    fixture = TestBed.createComponent(QuestionselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
