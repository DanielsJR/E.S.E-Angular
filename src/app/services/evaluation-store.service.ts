import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { map } from "rxjs/internal/operators/map";
import { Evaluation } from "../models/evaluation";
import { EvaluationBackendService } from "./evaluation-backend.service";



@Injectable({
    providedIn: 'root',
})
export class EvaluationStoreService {
    private dataStore: { evaluations: Evaluation[] };
    private evaluationsSource = <BehaviorSubject<Evaluation[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(private evaluationBackendService: EvaluationBackendService, private isLoadingService: IsLoadingService) {
        this.dataStore = { evaluations: [] };
    }

    get evaluations$() {
        return this.evaluationsSource.asObservable();
    }

    get isLoadingGetEvaluations$() {
        return this.isLoadingGet.asObservable();
    }

    getEvaluationsBySubject(id: string) {
        if (this.evaluationsSource.getValue().length) {
            console.log(`********GET-Evaluations-FROM-CACHE********`);
            this.evaluationsSource.next(this.dataStore.evaluations);
        } else {
            console.log(`********GET-Evaluations-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.evaluationBackendService.getEvaluationsBySubject(id)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.evaluations = data;
                        this.evaluationsSource.next(Object.assign({}, this.dataStore).evaluations);
                    } else {
                        data = null;
                        console.error('Lista de Evaluations vacia');
                    }
                }, error => console.error('error retrieving Evaluations, ' + error.message)
                );
        }

    }

    loadOneEvaluation(id: string) {
        return this.evaluations$
            .pipe(map(evaluations => evaluations.find(v => v.id === id)));
    }

    create(evaluation: Evaluation): Observable<Evaluation> {
        this.isLoadingService.isLoadingTrue();
        return this.evaluationBackendService.create(evaluation)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.evaluations.push(data);
                    this.evaluationsSource.next(Object.assign({}, this.dataStore).evaluations);
                }, error => console.error('could not create Evaluations, ' + error.message)
                ));
    }

    update(evaluation: Evaluation): Observable<Evaluation> {
        this.isLoadingService.isLoadingTrue();
        return this.evaluationBackendService.update(evaluation)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.evaluations.findIndex(v => v.id === data.id);
                    if (index != -1) {
                        this.dataStore.evaluations[index] = data;
                        this.evaluationsSource.next(Object.assign({}, this.dataStore).evaluations);
                    }

                }, err => console.error("Error updating Evaluation" + err.message)
                ));
    }

    delete(evaluation: Evaluation | string): Observable<Evaluation> {
        return this.evaluationBackendService.delete(evaluation)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.evaluations.findIndex((v: Evaluation) => v.id === ((typeof evaluation === 'string') ? evaluation : evaluation.id));
                    if (index != -1) {
                        this.dataStore.evaluations.splice(index, 1);
                        this.evaluationsSource.next(Object.assign({}, this.dataStore).evaluations);
                    }
                }, err => console.error("Error deleting Evaluation" + err.message)
                ));
    }

    clearStore(){
        console.log("****************Clearing the store******************");
        this.dataStore.evaluations = [];
        this.evaluationsSource.next(Object.assign({}, this.dataStore).evaluations);
    }



}


