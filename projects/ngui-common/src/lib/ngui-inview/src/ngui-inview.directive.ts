import {
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
    Renderer2
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

/**
 * Fires (nguiInview) or (nguiOutview) events dependents on the element is in viewport or not
 */
@Directive({
    selector: '[nguiInview], [nguiOutview]' // tslint:disable-line
})
export class NguiInviewDirective implements OnInit, OnDestroy {
    observer: IntersectionObserver;

    /** IntersectionObserver options */
    @Input() options: any = {};

    /** Event that will be fired when in viewport */
    @Output() nguiInview: EventEmitter<any> = new EventEmitter();
    /** Event that will be fired when out of  viewport */
    @Output() nguiOutview: EventEmitter<any> = new EventEmitter();

    constructor(
        public element: ElementRef,
        public renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: any) {
    }

    /** Starts IntersectionObserver */
    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
            this.observer.observe(this.element.nativeElement);
        }
    }

    /** Stops IntersectionObserver */
    ngOnDestroy(): void {
        if (isPlatformBrowser(this.platformId) && this.observer) {
            this.observer.disconnect();
        }
    }

    /**
     * Fires (nguiInview) event when this element is in viewport
     *  and fires (nguiOutview) event when this element is not in viewport
     */
    handleIntersect(entries): void {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry['isIntersecting']) {
                this.nguiInview.emit(entry);
            } else {
                this.nguiOutview.emit(entry);
            }
        });
    }
}
