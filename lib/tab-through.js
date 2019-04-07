'use babel';

import { CompositeDisposable } from 'atom';

export default {

  config: {
    skipChars: {
      type: 'string',
      title: 'Skip characters',
      description: 'Characters to consider for tabbing through',
      default: "(){}\"'`",
      order: 1
    }
  },
  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register commands
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'tab-through:moveRight': (e) => this.moveRight(e),
      'tab-through:moveLeft': (e) => this.moveLeft(e),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  moveRight(e) {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cursors = editor.getCursors();
      cursors.forEach((cursor) => {
        let posRow = cursor.getBufferRow();
        let posCol = cursor.getBufferColumn();
        let nextChar = editor.getTextInBufferRange([[posRow, posCol], [posRow, posCol + 1]]);

        let escapedChars = atom.config.get('tab-through.skipChars').replace(/(\[)(\])/, '\\$1\\$2');
        let reg = new RegExp(`[${escapedChars}]`);
        let canSkip = reg.test(nextChar);
        if (canSkip === true) {
          cursor.moveRight(1);
        } else {
          e.abortKeyBinding();
        }
      });
    }
  },

  moveLeft(e) {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let cursors = editor.getCursors();
      cursors.forEach((cursor) => {
        let posRow = cursor.getBufferRow();
        let posCol = cursor.getBufferColumn();
        let prevChar = editor.getTextInBufferRange([[posRow, posCol - 1], [posRow, posCol]]);

        let escapedChars = atom.config.get('tab-through.skipChars').replace(/(\[)(\])/, '\\$1\\$2');
        let reg = new RegExp(`[${escapedChars}]`);
        let canSkip = reg.test(prevChar);
        if (canSkip === true) {
          cursor.moveLeft(1);
        } else {
          e.abortKeyBinding();
        }
      });
    }
  }

};
