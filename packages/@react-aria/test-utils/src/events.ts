/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {act, fireEvent} from '@testing-library/react';

// Triggers a "longPress" event on an element.
export const DEFAULT_LONG_PRESS_TIME = 500;

export function triggerLongPress(element, opts = {}) {
  fireEvent.pointerDown(element, {pointerType: 'touch', ...opts});
  act(() => {
    jest.advanceTimersByTime(DEFAULT_LONG_PRESS_TIME);
  });
  fireEvent.pointerUp(element, {pointerType: 'touch', ...opts});
}

/**
 * Enables reading pageX/pageY from fireEvent.mouse*(..., {pageX: ..., pageY: ...}).
 */
export function installMouseEvent() {
  beforeAll(() => {
    let oldMouseEvent = MouseEvent;
    // @ts-ignore
    global.MouseEvent = class FakeMouseEvent extends MouseEvent {
      _init: {pageX: number, pageY: number};
      constructor(name, init) {
        super(name, init);
        this._init = init;
      }
      get pageX() {
        return this._init.pageX;
      }
      get pageY() {
        return this._init.pageY;
      }
    };
    // @ts-ignore
    global.MouseEvent.oldMouseEvent = oldMouseEvent;
  });
  afterAll(() => {
    // @ts-ignore
    global.MouseEvent = global.MouseEvent.oldMouseEvent;
  });
}

export function installPointerEvent() {
  beforeAll(() => {
    // @ts-ignore
    global.PointerEvent = class FakePointerEvent extends MouseEvent {
      _init: {pageX: number, pageY: number, pointerType: string, pointerId: number, width: number, height: number};
      constructor(name, init) {
        super(name, init);
        this._init = init;
      }
      get pointerType() {
        return this._init.pointerType ?? 'mouse';
      }
      get pointerId() {
        return this._init.pointerId;
      }
      get pageX() {
        return this._init.pageX;
      }
      get pageY() {
        return this._init.pageY;
      }
      get width() {
        return this._init.width;
      }
      get height() {
        return this._init.height;
      }
    };
  });
  afterAll(() => {
    // @ts-ignore
    delete global.PointerEvent;
  });
}
