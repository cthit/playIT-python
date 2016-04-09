import expect from 'expect'

import * as trackActions from '../src/actions/trackActions'
import * as mainActions from '../src/actions/mainActions'
import trackReducer from '../src/store/trackReducer'
import {main} from '../src/store/reducer'

describe('trackReducer', () => {
  it("should add track to items", () => {
    const state = {items: []}
    const track = {
      type: "bapedibop",
      value: 0,
      id: 5
    }
    expect(
      trackReducer(state, trackActions.receiveItemSuccess(track))
    ).toEqual({
      items: [track],
      selectedId: 5
    })
  });

  it('should navigate to track id', () => {
    const state = {items: [
      {id: 0},
      {id: 1}
    ]}
    expect(
      trackReducer(state, trackActions.setFeedNavigate(1))
    ).toEqual({
      ...state,
      selectedId: 1
    })
  })

  it('should upvote track', () => {
    const state = {
      items: [
        {id: 5, value: 1, user_vote: 0},
        {id: 6, value: 5, user_vote: 0}
      ],
      selectedId: 6
    }

    expect(
      trackReducer(state, trackActions.upvoteItem({id: 6})).items
    ).toEqual([
      {id: 6, value: 6, user_vote: 1},
      {id: 5, value: 1, user_vote: 0}
    ])
  })

  it('should downvote track', () => {
    const state = {
      items: [
        {id: 5, value: 1},
        {id: 6, value: 5}
      ],
      selectedId: 6
    }

    expect(
      trackReducer(state, trackActions.downvoteItem({id: 6})).items
    ).toEqual([
      {id: 6, value: 4, user_vote: -1},
      {id: 5, value: 1}
    ])
  })

  it('should navigate next id when selected is removed', () => {
    const state = {items: [
      {id: 0},
      {id: 1},
      {id: 37}
    ]
    , selectedId: 1
    }
    expect(
      trackReducer(state, trackActions.requestRemoveItem({id: 1}))
    ).toEqual({
      items: [
        {id: 0},
        {id: 37}
      ],
      selectedId: 37
    })
  })

  it('should remove item', () => {
    const state = {
    items: [
      {id: 0},
      {id: 3},
      {id: 7}
    ],
    selectedId: 0
    }
    expect(
      trackReducer(state, trackActions.requestRemoveItem({id: 3}))
    ).toEqual({
      items: [
        {id: 0},
        {id: 7}
      ],
      selectedId: 0
    })
  })

  it('should navigate to next item', () => {
    const state = {items: [
      {id: 0},
      {id: 3},
      {id: 7}
    ],
    selectedId: 3
    }
    expect(
      trackReducer(state, trackActions.feedNavigate(1))
    ).toEqual({
      ...state,
      selectedId: 7
    })
  })

  it('should navigate to new last item when last item is removed', () => {
    const state = {items: [
      {id: 0},
      {id: 3},
      {id: 7}
    ],
    selectedId: 7
    }
    expect(
      trackReducer(state, trackActions.requestRemoveItem({id: 7}))
    ).toEqual({
      items: [
        {id: 0},
        {id: 3}
      ],
      selectedId: 3
    })
  })

  it('should remove first item when set-now-playing', () => {
    const state = {
    items: [
      {id: 0},
      {id: 3},
      {id: 7}
    ],
    selectedId: 0
    }
    expect(
      trackReducer(state, mainActions.setNowPlaying({id: 0}))
    ).toEqual({
      items: [
        {id: 3},
        {id: 7}
      ],
      selectedId: 3
    })
  })

  it('should remove first and only item and set selectedId to -1', () => {
    const state = {
      items: [ {id: 0} ],
      selectedId: 0
    }
    expect(
      trackReducer(state, mainActions.setNowPlaying({id: 0}))
    ).toEqual({
      items: [],
      selectedId: 0
    })
  })
});
