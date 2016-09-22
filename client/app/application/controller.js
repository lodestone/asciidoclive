/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                           Copyright 2016 Chuan Ji                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* global $ */

import Ember from 'ember';

export default Ember.Controller.extend({
  // Injected by route.
  headerActionHandler: null,
  headerSaveStorageSpec: null,
  headerSaveTitle: null,

  storageProviders: Ember.inject.service(),
  settings: Ember.inject.service(),

  sendToHeaderActionHandler(action, args) {
    var handler = this.get('headerActionHandler');
    if (Ember.isNone(handler)) {
      console.warning('No navbar action handler registered!');
      return;
    }
    handler.send.apply(handler, [action].concat(
      Array.prototype.slice.call(args)));
  },

  headerSaveStorageTypeIcon: Ember.computed(
    'headerSaveStorageSpec.storageType', function() {
      var storageType = this.get('headerSaveStorageSpec.storageType');
      if (Ember.isNone(storageType)) {
        return null;
      }
      return this.get('storageProviders').getStorageProvider(storageType)
        .get('storageTypeIcon');
    }),

  headerSaveStorageTypeTranslation: Ember.computed(
    'headerSaveStorageSpec.storageType', function() {
      var storageType = this.get('headerSaveStorageSpec.storageType');
      if (Ember.isNone(storageType)) {
        return null;
      }
      return 'storageTypePrefix.' + storageType;
    }),

  recentFiles: Ember.computed(
    'settings.recentFiles.[]',
    'headerSaveStorageSpec.storageType',
    'headerSaveStorageSpec.storagePath',
    function() {
      var storageProviders = this.get('storageProviders');
      var headerSaveStorageType = this.get('headerSaveStorageSpec.storageType');
      var headerSaveStoragePath = this.get('headerSaveStorageSpec.storagePath');
      return this.get('settings.recentFiles')
        .reject(function(recentFile) {
          return recentFile.storage_type === headerSaveStorageType &&
            recentFile.storage_path === headerSaveStoragePath;
        }, this)
        .map(function(recentFile) {
          var storageType = recentFile.storage_type;
          return {
            storage_type: storageType,
            storage_path: recentFile.storage_path,
            title: recentFile.title,

            storageTypeIcon:
              storageProviders.getStorageProvider(storageType)
                .get('storageTypeIcon'),
            storageTypeTranslation: 'storageTypePrefix.' + storageType
          };
        }, this);
    }),

  isFaqModalVisible: false,
  isAboutModalVisible: false,
  isEditorThemeModalVisible: false,
  isHighlightjsThemeModalVisible: false,
  isFontModalVisible: false,
  isEditorModeModalVisible: false,

  bindLocalFileSelected: Ember.on('init', function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      $('#open-local-file-input').change(function() {
        this.sendToHeaderActionHandler('openLocal', arguments);
      }.bind(this));
    });
  }),

  actions: {
    open() {
      this.sendToHeaderActionHandler('open', arguments);
    },
    openRecent() {
      this.sendToHeaderActionHandler('openRecent', arguments);
    },
    openScratch() {
      this.sendToHeaderActionHandler('openScratch', arguments);
    },
    save() {
      this.sendToHeaderActionHandler('save', arguments);
    },
    saveAs() {
      this.sendToHeaderActionHandler('saveAs', arguments);
    },
    toggleSetting(key) {
      this.get('settings').set(key, !this.get('settings.' + key));
    },
    showFaqModal() {
      this.set('isFaqModalVisible', true);
    },
    showAboutModal() {
      this.set('isAboutModalVisible', true);
    },
    showEditorThemeModal() {
      this.set('isEditorThemeModalVisible', true);
    },
    showHighlightjsThemeModal() {
      this.set('isHighlightjsThemeModalVisible', true);
    },
    showFontModal() {
      this.set('isFontModalVisible', true);
    },
    showEditorModeModal() {
      this.set('isEditorModeModalVisible', true);
    },
    saveLocal() {
      this.sendToHeaderActionHandler('saveLocal', arguments);
    },
    downloadHtml() {
      this.sendToHeaderActionHandler('downloadHtml', arguments);
    }
  }
});
