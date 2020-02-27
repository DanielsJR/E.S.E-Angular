import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Grade } from '../../../models/grade';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { QuizStudent } from '../../../models/quiz-student';
import { DomSanitizer } from '@angular/platform-browser';
import { TRUE_FALSES, Quiz } from '../../../models/quiz';
import { Evaluation } from '../../../models/evaluation';
import { MatAccordion } from '@angular/material/expansion';



@Component({
  selector: 'nx-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.css']
})
export class QuizDetailComponent implements OnInit, AfterViewInit {


  quizDetailForm: FormGroup;

  detailCorrespondItemsForm: FormGroup;
  detailTrueFalseItemsForm: FormGroup;
  detailMultipleSelectionItemsForm: FormGroup;
  detailIncompleteTextItemsForm: FormGroup;

  panelOpenCorrespondItems = false;
  panelOpenTrueFalseItems = false;
  panelOpenMultipleSelectionItems = false;
  panelOpenIncompleteTextItems = false;

  accordionDisplayMode = 'flat';

  private _evaluation: Evaluation;


  @ViewChild('trueFalseItemsAccordion') trueFalseItemsAccordion: MatAccordion;

  @Input() set evaluation(evaluation: Evaluation) {
    if (evaluation.quiz) this._evaluation = evaluation;
    if (this._evaluation && this.quizDetailForm) this.buildForm();
  }

  get evaluation() {
    return this._evaluation;
  }

  @Output()
  closeQuizDetail = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, public sanitizer: DomSanitizer, ) { }

  ngOnInit() {
    this.buildForm();

  }

  ngAfterViewInit(): void {
    //this.trueFalseItemsAccordion.closeAll();
  }


  buildForm() {
    this.quizDetailForm = this.formBuilder.group({
      title: [this.evaluation.quiz.title],
      description: [this.evaluation.quiz.description],
      subjectName: [this.evaluation.subject.name],
      courseName: [this.evaluation.subject.course.name],
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

    this.setCorrespondItems(this.evaluation.quiz);
    this.setTrueFalseItems(this.evaluation.quiz);
    this.setMultipleSelectionItems(this.evaluation.quiz);
    this.setIncompleteTextItems(this.evaluation.quiz);

    //this.openClosePanels(false);


  }

  get title() { return this.quizDetailForm.get('title'); }
  get description() { return this.quizDetailForm.get('description'); }
  get subjectName() { return this.quizDetailForm.get('subjectName'); }
  get quizLevel() { return this.quizDetailForm.get('courseName'); }

  get correspondItems() { return this.detailCorrespondItemsForm.get('correspondItems'); }
  get trueFalseItems() { return this.detailTrueFalseItemsForm.get('trueFalseItems'); }
  get multipleSelectionItems() { return this.detailMultipleSelectionItemsForm.get('multipleSelectionItems'); }
  get incompleteTextItems() { return this.detailIncompleteTextItemsForm.get('incompleteTextItems'); }


  openClosePanels(value: boolean) {
    this.panelOpenCorrespondItems = value;
    this.panelOpenTrueFalseItems = value;
    this.panelOpenMultipleSelectionItems = value;
    this.panelOpenIncompleteTextItems = value;
  }

  setCorrespondItems(quiz: Quiz) {
    let control = <FormArray>this.detailCorrespondItemsForm.controls.correspondItems;
    quiz.correspondItems.forEach(ci => {
      control.push(this.formBuilder.group({
        item: [ci.item],
        correspond: [ci.correspond],
        //open: [true],
      }))
    })
  }

  setTrueFalseItems(quiz: Quiz) {
    let control = <FormArray>this.detailTrueFalseItemsForm.controls.trueFalseItems;
    quiz.trueFalseItems.forEach(tf => {
      control.push(this.formBuilder.group({
        sentence: [tf.sentence],
        answer: [(tf.answer === true) ? 'Verdadero' : 'Falso'],
        //open: [true],
      }))
    })
  }

  setMultipleSelectionItems(quiz: Quiz) {
    let control = <FormArray>this.detailMultipleSelectionItemsForm.controls.multipleSelectionItems;
    quiz.multipleSelectionItems.forEach(ms => {
      control.push(this.formBuilder.group({
        sentence: [ms.sentence],
        alternativeA: [ms.alternativeA],
        alternativeB: [ms.alternativeB],
        alternativeC: [ms.alternativeC],
        alternativeD: [ms.alternativeD],
        answer: [ms.answer],
        //open: [true],
      }));

    })

  }

  setIncompleteTextItems(quiz: Quiz) {
    let control = <FormArray>this.detailIncompleteTextItemsForm.controls.incompleteTextItems;
    quiz.incompleteTextItems.forEach(it => {
      control.push(this.formBuilder.group({
        sentence: [it.sentence],
        answer: [it.answer],
        //open: [true],
      }))
    })
  }

  closeButton() {
    this.closeQuizDetail.emit(null);
  }

}
