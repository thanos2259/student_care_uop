import { Component, ElementRef, Inject, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-edit-notes-dialog',
  templateUrl: './edit-notes-dialog.component.html',
  styleUrls: ['./edit-notes-dialog.component.css']
})
export class EditNotesDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('notesArea') notesArea!: ElementRef;
  private notes!: string;
  private appId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditNotesDialogComponent>, public managerService: ManagerService
  ) { }

  onCommentSubmit(): void {
    // Get latest value from html element
    const notes: string = this.notesArea.nativeElement.value;

    this.managerService.updateNotesByAppId(notes, this.appId);

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.notes = this.data.notes;
    this.appId = this.data.appId;
  }

  ngAfterViewInit(): void {
    if (this.notes) {
      this.notesArea.nativeElement.value = this.notes;
    }
  }

}
