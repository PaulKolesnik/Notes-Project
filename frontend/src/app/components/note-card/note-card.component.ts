import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Priorities } from 'src/app/shared/note.model';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title: string;
  @Input() priority: Priorities;
  @Input() body: string;
  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', { static: true }) truncator: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: true }) bodyText: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewAbleHeight = parseInt(style.getPropertyValue("height"), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewAbleHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    }
    else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onXButtonClicked(): void {
    this.deleteEvent.emit();
  }
}
