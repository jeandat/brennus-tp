import { Component, OnInit } from '@angular/core';


@Component({
    selector:'ba-not-found',
    template:`
        <div class="container">
            <section class="flexbox">
                <p class="title">404</p>
                <img src="assets/lost.jpg">
            </section>
        </div>
    `,
    styles:[ `
        section {
            flex-direction: column;
        }

        .title {
            font-size: 4rem;
            font-weight: 900;
        }

        img {
            margin-top: -2rem;
        }
    ` ]
})
export class NotFoundComponent implements OnInit {

    constructor() { }

    ngOnInit() {}

}
