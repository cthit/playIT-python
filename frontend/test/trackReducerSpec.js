import expect from 'expect'

import * as trackActions from '../src/actions/trackActions'
import trackReducer from '../src/store/trackReducer'

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
});
