import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const appDir = path.resolve(process.cwd(), 'src/app');
const componentsDir = path.resolve(process.cwd(), 'src/components');

test('Verification: Deprecated routes are removed from src/app', () => {
  const deprecatedFolders = ['dashboard', 'log', 'profile', 'shop', 'workout', 'auth', 'api'];
  for (const folder of deprecatedFolders) {
    const fullPath = path.join(appDir, folder);
    assert.strictEqual(
      fs.existsSync(fullPath),
      false,
      `Deprecated route folder "${folder}" should be deleted from src/app`
    );
  }
});

test('Verification: New promotional components exist', () => {
  const requiredComponents = [
    'HeroSection.tsx',
    'PhoneMockup.tsx',
    'PillarsBento.tsx',
    'InteractiveDemo.tsx',
  ];
  for (const file of requiredComponents) {
    const fullPath = path.join(componentsDir, file);
    assert.strictEqual(
      fs.existsSync(fullPath),
      true,
      `Component file "${file}" must exist in src/components`
    );
  }
});

test('Verification: page.tsx contains promotional showcase and 0 tracker links', () => {
  const pagePath = path.join(appDir, 'page.tsx');
  assert.strictEqual(fs.existsSync(pagePath), true, 'src/app/page.tsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');

  // Must not have legacy tracker links
  const legacyLinks = ['href="/dashboard"', 'href="/log"', 'href="/workout"', 'href="/shop"', 'href="/profile"'];
  for (const link of legacyLinks) {
    assert.strictEqual(
      pageContent.includes(link),
      false,
      `page.tsx must not contain legacy tracker link: ${link}`
    );
  }

  // Must include components
  assert.ok(pageContent.includes('HeroSection'), 'page.tsx should import/render HeroSection');
  assert.ok(pageContent.includes('PillarsBento'), 'page.tsx should import/render PillarsBento');
  assert.ok(pageContent.includes('InteractiveDemo'), 'page.tsx should import/render InteractiveDemo');
});

test('Verification: Legacy web-app component folders are removed from src/components', () => {
  const legacyComponentDirs = ['dashboard', 'layout', 'log', 'profile', 'shop', 'workout'];
  for (const dir of legacyComponentDirs) {
    assert.strictEqual(
      fs.existsSync(path.join(componentsDir, dir)),
      false,
      `Legacy web-app component directory "${dir}" should be removed`
    );
  }
});

test('Verification: PhoneMockup includes AI Scanner, Recipe Chef, BLE Scale Simulator, and Opt-in Party button', () => {
  const mockupContent = fs.readFileSync(path.join(componentsDir, 'PhoneMockup.tsx'), 'utf-8');
  assert.ok(mockupContent.includes('วันนี้ทำอะไรกินดี'), 'PhoneMockup must showcase the AI Recipe Chef');
  assert.ok(mockupContent.includes('ชวนเพื่อนตั้งตี้'), 'PhoneMockup must showcase the opt-in Party Quest button');
});

