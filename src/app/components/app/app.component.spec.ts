import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compiled: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
        compiled = fixture.debugElement.nativeElement;
    });

    it("should create the app", () => {
        expect(app).toBeTruthy();
    });

    it(`should have as title 'Redux Demo Application'`, () => {
        expect(app.title).toEqual("Redux Demo Application");
    });

    it("should render title in a h1 tag", () => {
        expect(compiled.querySelector("h1").textContent).toContain("Redux Demo Application");
    });

    it("should contain a navigation bar", async(() => {
        expect(compiled.querySelector("nav")).not.toBe(null);
    }));

    it("should have links in the navigation bar", async(() => {
        const links = compiled.querySelectorAll("nav a");
        expect(links.length).toBe(2);
        expect(links[0].href).toMatch(/\/counters/);
        expect(links[1].href).toMatch(/\/dashboard/);
    }));
});
