import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngAvatarComponent } from './ong-avatar.component';

describe('OngAvatarComponent', () => {
  let component: OngAvatarComponent;
  let fixture: ComponentFixture<OngAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OngAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
