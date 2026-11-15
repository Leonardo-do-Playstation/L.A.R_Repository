import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { SobreComponent } from './sobre.component';

describe('SobreComponent', () => {
  let component: SobreComponent;
  let fixture: ComponentFixture<SobreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SobreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to the terms of use and the privacy policy', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('a[href="/termos"]')).toBeTruthy();
    expect(element.querySelector('a[href="/privacidade"]')).toBeTruthy();
  });
});
