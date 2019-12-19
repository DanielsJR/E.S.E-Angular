import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Grade } from '../../../models/grade';
import { QuizStudent } from '../../../models/quiz-student';


@Component({
  selector: 'nx-quiz-student-detail',
  templateUrl: './quiz-student-detail.component.html',
  styleUrls: ['./quiz-student-detail.component.css']
})
export class QuizStudentDetailComponent implements OnInit {

  quizStudentDetailForm: FormGroup;

  detailCorrespondItemsForm: FormGroup;
  detailTrueFalseItemsForm: FormGroup;
  detailMultipleSelectionItemsForm: FormGroup;
  detailIncompleteTextItemsForm: FormGroup;

  panelOpenCorrespondItems = false;
  panelOpenTrueFalseItems = false;
  panelOpenMultipleSelectionItems = false;
  panelOpenIncompleteTextItems = false;

  private _grade: Grade;

  ciAnswers: number[] = [];
  tfAnswers: number[] = [];
  msAnswers: number[] = [];
  itAnswers: number[] = [];

  @Input() set grade(grade: Grade) {
    if (grade.quizStudent) this._grade = grade;
    if (this._grade && this.quizStudentDetailForm) this.buildForm();
  }

  get grade() {
    return this._grade;
  }

  constructor(private formBuilder: FormBuilder, public sanitizer: DomSanitizer, ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.quizStudentDetailForm = this.formBuilder.group({
      title: [this.grade.evaluation.quiz.title],
      //description: [this.grade.evaluation.quiz.description],
      subjectName: [this.grade.evaluation.subject.name],
      courseName: [this.grade.evaluation.subject.course.name],
    });


    this.detailCorrespondItemsForm = this.formBuilder.group({
      correspondItems: this.formBuilder.array([]),
    });

    this.detailTrueFalseItemsForm = this.formBuilder.group({
      trueFalseItems: this.formBuilder.array([]),
    });

    this.detailMultipleSelectionItemsForm = this.formBuilder.group({
      multipleSelectionItems: this.formBuilder.array([]),
    });

    this.detailIncompleteTextItemsForm = this.formBuilder.group({
      incompleteTextItems: this.formBuilder.array([]),
    });

    this.setCorrespondItems(this.grade.quizStudent);
    this.setTrueFalseItems(this.grade.quizStudent);
    this.setMultipleSelectionItems(this.grade.quizStudent);
    this.setIncompleteTextItems(this.grade.quizStudent);

    this.panelsClosed();

  }

  get title() { return this.quizStudentDetailForm.get('title'); }
  //get description() { return this.quizStudentDetailForm.get('description'); }
  get subjectName() { return this.quizStudentDetailForm.get('subjectName'); }
  get quizLevel() { return this.quizStudentDetailForm.get('courseName'); }

  get correspondItems() { return this.detailCorrespondItemsForm.get('correspondItems'); }
  get trueFalseItems() { return this.detailTrueFalseItemsForm.get('trueFalseItems'); }
  get multipleSelectionItems() { return this.detailMultipleSelectionItemsForm.get('multipleSelectionItems'); }
  get incompleteTextItems() { return this.detailIncompleteTextItemsForm.get('incompleteTextItems'); }



  panelsClosed() {
    this.panelOpenCorrespondItems = false;
    this.panelOpenTrueFalseItems = false;
    this.panelOpenMultipleSelectionItems = false;
    this.panelOpenIncompleteTextItems = false;
  }

  setCorrespondItems(quiz: QuizStudent) {
    let control = <FormArray>this.detailCorrespondItemsForm.controls.correspondItems;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quiz.correspondItems.forEach(ci => {
      (ci.correct) ? correctAnswers++ : incorrectAnswers++;
      control.push(this.formBuilder.group({
        item: [ci.item],
        correspond: [ci.correspond],
        correct: [ci.correct],
        open: [false],
      }));
    });
    this.ciAnswers = [correctAnswers, incorrectAnswers];
  }

  setTrueFalseItems(quiz: QuizStudent) {
    let control = <FormArray>this.detailTrueFalseItemsForm.controls.trueFalseItems;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quiz.trueFalseItems.forEach(tf => {
      (tf.correct) ? correctAnswers++ : incorrectAnswers++;
      control.push(this.formBuilder.group({
        sentence: [tf.sentence],
        answer: [(tf.answer === true) ? 'Verdadero' : 'Falso'],
        correct: [tf.correct],
        open: [false],
      }));
    });
    this.tfAnswers = [correctAnswers, incorrectAnswers];
  }

  setMultipleSelectionItems(quiz: QuizStudent) {
    let control = <FormArray>this.detailMultipleSelectionItemsForm.controls.multipleSelectionItems;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quiz.multipleSelectionItems.forEach(ms => {
      (ms.correct) ? correctAnswers++ : incorrectAnswers++;
      control.push(this.formBuilder.group({
        sentence: [ms.sentence],
        alternativeA: [ms.alternativeA],
        alternativeB: [ms.alternativeB],
        alternativeC: [ms.alternativeC],
        alternativeD: [ms.alternativeD],
        answer: [ms.answer],
        correct: [ms.correct],
        open: [false],
      }));
    });

    this.msAnswers = [correctAnswers, incorrectAnswers];

  }

  setIncompleteTextItems(quiz: QuizStudent) {
    let control = <FormArray>this.detailIncompleteTextItemsForm.controls.incompleteTextItems;
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quiz.incompleteTextItems.forEach(it => {
      (it.correct) ? correctAnswers++ : incorrectAnswers++;
      control.push(this.formBuilder.group({
        sentence: [it.sentence],
        answer: [it.answer],
        correct: [it.correct],
        open: [false],
      }));
    });
    this.itAnswers = [correctAnswers, incorrectAnswers];
  }

  checkAnswerIcon(value: boolean): string {
    return value ? "check" : "close";
  }

  checkAnswerColor(value: boolean): string {
    return value ? "primary" : "warn";
  }

}

