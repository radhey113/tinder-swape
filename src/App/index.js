import React, {PureComponent} from 'react'
import $ from 'jquery';
import Hammer from 'hammerjs';
import './index.scss';
import Images from '../Shared/Images';
import * as nearByUser from '../Shared/mocks/nearbyUserList';

export default class index extends PureComponent {
    constructor() {
        super();
        this.state = {
            users: nearByUser.nearByUser,
            totalCard: nearByUser.nearByUser.length
        };
        this.likeOrDislike = this.likeOrDislike.bind(this);
        this.cardInitialState = this.cardInitialState.bind(this);
    }

    componentDidMount() {
        let self = this;
        $(document).ready(function () {
            var tinderContainer = document.querySelector('.tinder');
            var allCards = document.querySelectorAll('.tinder--card');

            self.cardInitialState();
            allCards.forEach((el, index) => {
                var hammertime = new Hammer(el);

                hammertime.on('pan', function (event) {
                    el.classList.add('moving');
                });

                hammertime.on('pan', function (event) {
                    if (event.deltaX === 0) return;
                    if (event.center.x === 0 && event.center.y === 0) return;

                    tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
                    tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

                    var xMulti = event.deltaX * 0.03;
                    var yMulti = event.deltaY / 80;
                    var rotate = xMulti * yMulti;

                    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
                });

                hammertime.on('panend', (event) => {
                    el.classList.remove('moving');
                    tinderContainer.classList.remove('tinder_love');
                    tinderContainer.classList.remove('tinder_nope');

                    var moveOutWidth = document.body.clientWidth;
                    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

                    event.target.classList.toggle('removed', !keep);
                    if (keep) {
                        event.target.style.transform = '';
                    } else {
                        var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
                        var toX = event.deltaX > 0 ? endX : -endX;
                        var endY = Math.abs(event.velocityY) * moveOutWidth;
                        var toY = event.deltaY > 0 ? endY : -endY;
                        var xMulti = event.deltaX * 0.03;
                        var yMulti = event.deltaY / 80;
                        var rotate = xMulti * yMulti;

                        event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
                        self.cardInitialState();
                    }
                });
            });
        })
    }

    likeOrDislike(love) {
        let self = this;
        $(document).ready(function () {
            var cards = document.querySelectorAll('.tinder--card:not(.removed)');
            var moveOutWidth = document.body.clientWidth * 1.5;

            if (!cards.length) return false;
            var card = cards[0];
            card.classList.add('removed');

            if (love) {
                card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
            } else {
                card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
            }
            self.cardInitialState();
        })
    }

    cardInitialState(card, index) {
        var newCards = document.querySelectorAll('.tinder--card:not(.removed)');
        var tinderContainer = document.querySelector('.tinder');
        var allCards = document.querySelectorAll('.tinder--card');

        newCards.forEach(function (card, index) {
            card.style.zIndex = allCards.length - index;
            card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
            card.style.opacity = (10 - index) / 10;
        });
        tinderContainer.classList.add('loaded');
        this.setState({
            totalCard: newCards
        });
    }

    render() {
        return (
            <div className="tinder">
                <div className="tinder--cards">
                    {
                        this.state.totalCard ?
                            this.state.users && this.state.users.map((user, index) => {
                                return (
                                    <div className="tinder--card" key={index}>
                                        <img
                                            src={user.image} alt={'username'}/>
                                        <div className='user-info' style={{'textAlign': 'left'}}>
                                            <h3><b>{user.name}</b></h3>
                                            <p><b>{user.campus}</b></p>
                                            <p><b>{user.age}</b> Years Old</p>
                                        </div>

                                        <div className="tinder--buttons">
                                            <div id="nope" onClick={() => this.likeOrDislike(false)}
                                                 className="icon-wrapper" style={{"marginBottom": "10px"}}>
                                                <i className="fa fa-thumbs-down dislike"> </i>
                                            </div>

                                            <div id="love" onClick={() => this.likeOrDislike(true)} className="icon-wrapper"
                                                 style={{"background": "#f12781"}}>
                                                <i className="fa fa-thumbs-up like"> </i>
                                            </div>
                                        </div>

                                        <div className={'card-footer'}>
                                            <small>
                                                {user.distance <= 1 ? `Match is nearby 1km` : `Match is ${Math.floor(user.distance)} km far`}
                                            </small>
                                        </div>
                                    </div>

                                )
                            }) : <img src={Images.LOADER_GIF} alt={'Loader...'}/>
                    }
                </div>
            </div>
        )
    }
};
