/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type {GlobalConfig} from 'types/Config';
import BaseWatchPlugin from '../base_watch_plugin';
import TestNamePatternPrompt from '../test_name_pattern_prompt';
import activeFilters from '../lib/active_filters_message';
import Prompt from '../lib/Prompt';

class TestNamePatternPlugin extends BaseWatchPlugin {
  _prompt: Prompt;

  constructor(options: {
    stdin: stream$Readable | tty$ReadStream,
    stdout: stream$Writable | tty$WriteStream,
  }) {
    super(options);
    this._prompt = new Prompt();
  }

  getUsageInfo() {
    return {
      key: 't'.codePointAt(0),
      prompt: 'filter by a test name regex pattern',
    };
  }

  onKey(key: string) {
    this._prompt.put(key);
  }

  run(globalConfig: GlobalConfig, updateConfigAndRun: Function): Promise<void> {
    return new Promise((res, rej) => {
      const testPathPatternPrompt = new TestNamePatternPrompt(
        this._stdout,
        this._prompt,
      );

      testPathPatternPrompt.run(
        (value: string) => {
          updateConfigAndRun({testNamePattern: value});
          res();
        },
        rej,
        {
          header: activeFilters(globalConfig),
        },
      );
    });
  }
}

export default TestNamePatternPlugin;
