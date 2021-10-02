import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Note, Priorities } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {

  note: Note;
  noteId: number;
  new: boolean;
  
  priorities = [
    { id: 1, name: "Low" },
    { id: 2, name: "Normal" },
    { id: 3, name: "High" },
  ];
  constructor(
    private notesServices: NotesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.note = new Note();
      if (params.id) {
        this.note = this.notesServices.get(params.id);
        this.noteId = params.id;
        this.new = false;
      }
      else {
        this.new = true;
      }
    });
  }

  saveNote(form: NgForm) {
    if (this.new) {
      this.notesServices.add(form.value);
    }
    else {
      this.notesServices.update(this.noteId, form.value.title, form.value.body, form.value.priority);
    }
    this.router.navigateByUrl('/');
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
