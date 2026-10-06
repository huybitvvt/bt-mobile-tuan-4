const test = require('node:test');
const assert = require('node:assert/strict');
const loadSource = require('./loadSource.cjs');

function setup({ platform = 'web', granted = true, canceled = false,
  asset = { uri: 'file:///temporary/photo.png', width: 4000, height: 3000 }, fail = false } = {}) {
  const calls = [];
  const context = {
    resize: (size) => { calls.push(['resize', size]); return context; },
    renderAsync: async () => ({ saveAsync: async (options) => {
      calls.push(['save', options]);
      if (fail) throw new Error('Image processing failed');
      return { base64: '/9j/2Q==' };
    } }),
  };
  const { pickAvatar } = loadSource('src/pickAvatar.js', {
    'react-native': { Platform: { OS: platform } },
    'expo-image-picker': {
      requestMediaLibraryPermissionsAsync: async () => { calls.push(['permission']); return { granted }; },
      launchImageLibraryAsync: async (options) => { calls.push(['picker', options]); return { canceled, assets: [asset] }; },
    },
    'expo-image-manipulator': {
      SaveFormat: { JPEG: 'jpeg' },
      ImageManipulator: { manipulate: (uri) => { calls.push(['manipulate', uri]); return context; } },
    },
    './studentModel': loadSource('src/studentModel.js'),
  });
  return { pickAvatar, calls };
}

test('Device photo is resized and compressed to a durable JPEG instead of storing its cache URI', async () => {
  const { pickAvatar, calls } = setup({ platform: 'android' });
  assert.equal(await pickAvatar(), 'data:image/jpeg;base64,/9j/2Q==');
  assert.equal(calls[0][0], 'permission');
  assert.deepEqual(calls.find(([name]) => name === 'resize')[1], { width: 256 });
  assert.deepEqual(calls.find(([name]) => name === 'save')[1], { format: 'jpeg', compress: 0.75, base64: true });
  assert.deepEqual(calls.find(([name]) => name === 'picker')[1].mediaTypes, ['images']);
});

test('Denied photo permission never opens the native picker', async () => {
  const { pickAvatar, calls } = setup({ platform: 'ios', granted: false });
  await assert.rejects(pickAvatar(), /avatarPermission/);
  assert.deepEqual(calls, [['permission']]);
});

test('Cancelling selection returns no replacement and never processes an image', async () => {
  const { pickAvatar, calls } = setup({ canceled: true });
  assert.equal(await pickAvatar(), null);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'picker');
});

test('Web selection starts directly without awaiting a permission prompt', async () => {
  const { pickAvatar, calls } = setup();
  await pickAvatar();
  assert.equal(calls[0][0], 'picker');
  assert.equal(calls[0][1].allowsEditing, false);
});

test('Portrait images keep their ratio and small images are not enlarged', async () => {
  const portrait = setup({ asset: { uri: 'file:///photo.jpg', width: 1200, height: 2000 } });
  await portrait.pickAvatar();
  assert.deepEqual(portrait.calls.find(([name]) => name === 'resize')[1], { height: 256 });
  const small = setup({ asset: { uri: 'file:///photo.jpg', width: 100, height: 80 } });
  await small.pickAvatar();
  assert.equal(small.calls.some(([name]) => name === 'resize'), false);
});

test('Unreadable selections and processing failures reject without returning a broken avatar', async () => {
  await assert.rejects(setup({ asset: { uri: 'file:///bad.png', width: 0, height: 0 } }).pickAvatar(), /avatarPickError/);
  await assert.rejects(setup({ fail: true }).pickAvatar(), /Image processing failed/);
});
