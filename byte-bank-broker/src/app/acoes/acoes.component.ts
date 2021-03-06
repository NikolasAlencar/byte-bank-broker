import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge } from "rxjs";
import { switchMap, tap, filter, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AcoesService } from "./acoes.service";

const ESPERA_DIGITACAO: number = 500;

@Component({
  selector: "app-acoes",
  templateUrl: "./acoes.component.html",
  styleUrls: ["./acoes.component.css"]
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes().pipe(tap(() => console.log("Fluxo Inicial")));
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(ESPERA_DIGITACAO),
    tap(() => console.log("Fluxo do filtro")),
    filter(valorDigitado => valorDigitado.length >= 3 || !valorDigitado.length),
    distinctUntilChanged(),
    switchMap(valorDigitado => this.acoesService.getAcoes(valorDigitado))
  );
  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {}
}
