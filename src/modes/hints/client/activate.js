import { msg } from 'mosi/client'
import { mouseEvent } from 'lib/dom'
import { isMac } from 'lib/keys'

let activator
export function configureActivate (_activator = 'openLink') {
  activator = _activator
}

export function activate (event, target) {
  return activators[activator](event, target)
}

/**
 * An object containing callbacks that are executed when a target element
 * is selected using hints mode.
 * @type {{ [key: string]: (event: KeyboardEvent, target: HTMLElement) => string }}
 */
const activators = {
  openLink: (event, target) => {
    if (
      SAKA_PLATFORM === 'firefox' &&
      target.nodeName === 'A' &&
      target.target === '_blank'
    ) {
      // TODO: click() but prevent default
      backgroundOpenLink('openLinkInBackgroundTab', target)
    } else {
      mouseEvent(target, 'click')
    }
    target.focus()
    return 'Reset'
  },
  openLinkInBackgroundTab: (event, target) => {
    mouseEvent(target, 'click', { ctrlKey: !isMac, metaKey: isMac })
    if (SAKA_PLATFORM === 'firefox') {
      backgroundOpenLink('openLinkInBackgroundTab', target)
    }
    target.focus()
    return 'Reset'
  },
  openLinkInForegroundTab: (event, target) => {
    mouseEvent(target, 'click', {
      ctrlKey: !isMac,
      metaKey: isMac,
      shiftKey: true
    })
    if (SAKA_PLATFORM === 'firefox') {
      backgroundOpenLink('openLinkInForegroundTab', target)
    }
    target.focus()
    return 'Reset'
  },
  openLinkInNewWindow: (event, target) => {
    mouseEvent(target, 'click', { shiftKey: true })
    if (SAKA_PLATFORM === 'firefox') {
      backgroundOpenLink('openLinkInNewWindow', target)
    }
    target.focus()
    return 'Reset'
  },
  openLinkInIncognitoWindow: (event, target) => {
    mouseEvent(target, 'click', {
      shiftKey: true,
      ctrlKey: !isMac,
      metaKey: isMac
    })
    backgroundOpenLink('openLinkInIncognitoWindow', target)
    target.focus()
    return 'Reset'
  },
  downloadLink: (event, target) => {
    // TODO: Implement on Firefox
    mouseEvent(target, 'click', { altKey: true })
    target.focus()
    return 'Reset'
  },
  focusLink: (event, target) => {
    target.focus()
    return 'Reset'
  }
}

function backgroundOpenLink (hintType, target) {
  if (target.href) {
    msg(1, hintType, target.href)
  }
}
