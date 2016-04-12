import expect from 'expect'

import * as playlistActions from '../src/actions/playlistActions'
import * as mainActions from '../src/actions/mainActions'
import playlistReducer from '../src/store/playlistReducer'
import {main} from '../src/store/reducer'

describe('playlistReducer', () => {
  it("should add track to items", () => {
    const state = {items: []}
    const track = {
      type: "bapedibop",
      value: 0,
      id: 5
    }
    expect(
      playlistReducer(state, playlistActions.receiveItemSuccess(track))
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
      playlistReducer(state, playlistActions.setFeedNavigate(1))
    ).toEqual({
      ...state,
      selectedId: 1
    })
  })

  it('should upvote track', () => {
    const state = {
      items: [
        {id: 6, value: 5, user_vote: 0},
        {id: 5, value: 1, user_vote: 0}
      ],
      selectedId: 6
    }

    expect(
      playlistReducer(state, playlistActions.upvoteItem({id: 6})).items
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
      playlistReducer(state, playlistActions.downvoteItem({id: 6})).items
    ).toEqual([
      {id: 5, value: 1},
      {id: 6, value: 4, user_vote: -1}
    ])
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
      playlistReducer(state, playlistActions.requestRemoveItem({id: 3}))
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
      playlistReducer(state, playlistActions.feedNavigate(1))
    ).toEqual({
      ...state,
      selectedId: 7
    })
  })
});
