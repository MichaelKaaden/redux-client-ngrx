import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from "@angular/material/tabs";

@NgModule({
    imports: [MatButtonModule, MatIconModule],
    exports: [MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule],
})
export class MaterialModule {}
