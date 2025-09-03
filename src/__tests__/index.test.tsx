// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import '@testing-library/jest-dom'
import { expect, test, vi } from 'vitest'
import { render, getQueriesForElement } from '@lynx-js/react/testing-library'

import { App } from '../App.jsx'

test('App', async () => {
  const cb = vi.fn()

  render(
    <App
      onRender={() => {
        cb(`__MAIN_THREAD__: ${__MAIN_THREAD__}`)
      }}
    />,
  )
  expect(cb).toBeCalledTimes(1)
  expect(cb.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "__MAIN_THREAD__: false",
      ],
    ]
  `)
  expect(elementTree.root).toMatchInlineSnapshot(`
    <page>
      <view>
        <view
          class="Background"
        />
        <view
          class="App"
        >
          <view
            class="Banner"
          >
            <text
              class="Title"
            >
              カロリー計算アプリ
            </text>
          </view>
          <wrapper>
            <view
              class="Content"
            >
              <text
                class="Title"
              >
                ホーム（メイン）
              </text>
              <text
                class="Description"
              >
                リアルタイム歩数・消費カロリー表示
              </text>
              <text
                class="Description"
              >
                今日の摂取カロリー・残りカロリー
              </text>
              <text
                class="Description"
              >
                今日のカロリー収支サマリー
              </text>
            </view>
          </wrapper>
          <view
            style="flex:1"
          />
          <wrapper>
            <view
              class="navigation-bar"
            >
              <view
                class="nav-item nav-item--active"
              >
                <wrapper>
                  <text
                    class="nav-icon"
                  >
                    🏠
                  </text>
                  <text
                    class="nav-label"
                  >
                    ホーム
                  </text>
                </wrapper>
              </view>
              <view
                class="nav-item "
              >
                <wrapper>
                  <text
                    class="nav-icon"
                  >
                    🍽️
                  </text>
                  <text
                    class="nav-label"
                  >
                    食事
                  </text>
                </wrapper>
              </view>
              <view
                class="nav-item "
              >
                <wrapper>
                  <text
                    class="nav-icon"
                  >
                    📅
                  </text>
                  <text
                    class="nav-label"
                  >
                    カレンダー
                  </text>
                </wrapper>
              </view>
              <view
                class="nav-item "
              >
                <wrapper>
                  <text
                    class="nav-icon"
                  >
                    👤
                  </text>
                  <text
                    class="nav-label"
                  >
                    プロフィール
                  </text>
                </wrapper>
              </view>
            </view>
          </wrapper>
        </view>
      </view>
    </page>
  `)
  const {
    findByText,
  } = getQueriesForElement(elementTree.root!)
  const element = await findByText('ホーム（メイン）')
  expect(element).toBeInTheDocument()
  expect(element).toMatchInlineSnapshot(`
    <text
      class="Title"
    >
      ホーム（メイン）
    </text>
  `)
})
