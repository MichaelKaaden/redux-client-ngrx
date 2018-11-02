import { NgModule } from "@angular/core";
import {
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
} from "@angular/material";

@NgModule({
    imports: [MatButtonModule, MatIconModule],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
    ],
})
export class MaterialModule {}
