import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NostockdataComponent } from './nostockdata.component';

describe('NostockdataComponent', () => {
  let component: NostockdataComponent;
  let fixture: ComponentFixture<NostockdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NostockdataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NostockdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
