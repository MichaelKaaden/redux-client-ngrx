import { NgModule } from "@angular/core";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";

@NgModule({
    imports: [MatButtonModule, MatIconModule],
    exports: [MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatProgressSpinnerModule, MatTabsModule],
})
export class MaterialModule {}
