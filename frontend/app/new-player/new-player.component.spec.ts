import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlayerComponent } from './new-player.component';

describe('NewPlayerComponent', () => {
  let component: NewPlayerComponent;
  let fixture: ComponentFixture<NewPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
