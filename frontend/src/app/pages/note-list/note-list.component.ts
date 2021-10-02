import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  constructor(private notesServices: NotesService) { }

  ngOnInit(): void {
    this.notes = this.notesServices.getAll();
    this.filteredNotes = this.notesServices.getAll();
  }

  deleteNote(note: Note): void {
    const id = this.notesServices.getId(note);
    this.notesServices.delete(id);
  }

  filter(query: string): void {
    query = query.toLowerCase().trim();

    let allResults = new Array<Note>();

    let terms: string[] = query.split(' ');
    // remove duplicate search term
    terms = this.removeDuplicates(terms);

    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      // append results to all results array
      allResults = [...allResults, ...results];
    });

    const uniqueResults = this.removeDuplicates(allResults);

    this.filteredNotes = uniqueResults;


    // now sort by relevancy
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults)
  }

  relevantNotes(query: string) {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false
    });
    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: Object = {} // Format - key:value => NoteId:number

    searchResults.forEach(note => {
      let noteId = this.notesServices.getId(note);
      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      const aId = this.notesServices.getId(a);
      const bId = this.notesServices.getId(b);

      const aCount = noteCountObj[aId]
      const bCount = noteCountObj[bId]

      return bCount - aCount;
    });

  }
}
