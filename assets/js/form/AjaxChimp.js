// ajaxChimp.js – Native modern JS version

const AjaxChimp = () => {
  // Global timer to prevent rapid submits
  let timer = 0

  const responses = {
    100: 'Submitting...',
    0: 'We have sent you a confirmation email',
    1: 'Please enter a value',
    2: 'An email address must contain a single @.',
    3: 'The domain portion of the email address is invalid (the portion after the @: {variable})',
    4: 'The username portion of the email address is invalid (the portion after the @: {variable})',
    5: 'This email address looks fake or invalid. Please enter a real email address',
    6: 'Too many recent signup requests',
    7: "You're already subscribed, your profile has been updated. Thank you!"
  }

  const translations = {
    en: responses,
    de: {
      100: 'Anmeldung wird geprüft ...',
      0: 'Presto! Klicken Sie jetzt den Link im Bestätigungs-Mail an um die Anmeldung abzuschliessen. Herzlichen Dank!',
      1: 'Bitte alle Felder ausfüllen!',
      2: 'Es fehlt ein @-Zeichen!',
      3: 'Ungültige Domäne in der E-Mailadresse (der Teil nach dem @: {variable})!',
      4: 'Ungültiger Benutzername in der E-Mailadresse (der Teil vor dem @: {variable})!',
      5: 'Diese E-Mailadresse scheint gefälscht bzw. ungültig zu sein. Bitte geben Sie eine echte E-Mailadresse an!',
      6: 'Zuviele Anmeldeversuche!',
      7: 'Sie sind bereits angemeldet, Ihr Profil wurde aktualisiert. Vielen Dank!'
    },
    fr: {
      100: 'Inscription en cours de vérification ...',
      0: 'Presto ! Cliquez maintenant sur le lien dans le mail de confirmation pour terminer l`inscription. Merci beaucoup !',
      1: 'Veuillez remplir tous les champs !',
      2: 'Il manque le signe @ !',
      3: 'Domaine non valide dans l`adresse e-mail (la partie après le @ : {variable}) !',
      4: 'Nom d`utilisateur non valide dans l`adresse e-mail (la partie avant le @ : {variable}) !',
      5: 'Cette adresse e-mail semble être falsifiée ou non valide. Veuillez saisir une véritable adresse e-mail !',
      6: 'Trop de tentatives de connexion !',
      7: 'Vous êtes déjà inscrit, votre profil a été mis à jour. Merci beaucoup !'
    }
  }

  // Translates a message (number or string) to the current language text.
  const $t = (msg, variable = '', lang = 'en') => {
    const langTrans = translations[lang] || translations.en
    if (typeof msg === 'number') {
      return langTrans[msg]
    } else {
      for (const key in responses) {
        if (responses[key] === msg) {
          let out = langTrans[key]
          return variable ? out.replace('{variable}', variable) : out
        }
      }
    }
    return variable ? msg.replace('{variable}', variable) : msg
  }

  // JSONP helper: creates a script tag and returns a Promise that resolves on callback.
  const jsonp = (url, callbackName) =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script')
      window[callbackName] = (data) => {
        resolve(data)
        delete window[callbackName]
        script.remove()
      }
      script.onerror = () => {
        reject(new Error(`JSONP request to ${url} failed`))
        delete window[callbackName]
        script.remove()
      }
      script.src = url
      document.body.appendChild(script)
    })

  // Serialize form data into query string format.
  const serializeForm = (form) =>
    new URLSearchParams(new FormData(form)).toString()

  // Simple helpers to show/hide elements (replace with your preferred animation if needed)
  const slideDown = (el) => {
    el.style.display = 'block'
  }
  const slideUp = (el) => {
    el.style.display = 'none'
  }

  // The main function: attach ajaxChimp behavior to each form matching the selector.
  const attach = (form, options = {}) => {
    // Skip if any honeypot fields are filled
    if (
      form.querySelector('input[name="b_name"]')?.value ||
      form.querySelector('input[name="b_email"]')?.value ||
      form.querySelector('textarea[name="b_comment"]')?.value
    ) {
      return
    }

    const email = form.querySelector('input[type="email"]')
    if (!email) return
    const emailId = email.getAttribute('id')
    let label = form.querySelector(`label[for="${emailId}"]`)

    const fname = form.querySelector('input[name="fname"]')
    const lname = form.querySelector('input[name="lname"]')
    const fnlabel = fname
      ? form.querySelector(`label[for="${fname.getAttribute('id')}"]`)
      : null
    const lnlabel = lname
      ? form.querySelector(`label[for="${lname.getAttribute('id')}"]`)
      : null
    const button = form.querySelector('button[type="submit"]')
    if (button) {
      button.classList.remove('loading')
      button.disabled = false
    }

    // Merge user options with defaults.
    const settings = Object.assign(
      {
        url: form.getAttribute('action'),
        language: 'en',
        responseDiv: '',
        callback: null
      },
      options
    )

    // Adjust the Mailchimp URL for JSONP.
    let url = settings.url.replace('/post?', '/post-json?')
    url += (url.includes('?') ? '&' : '?') + 'c=callback'

    //form.setAttribute('novalidate', 'true')
    if (fname) fname.setAttribute('name', 'FNAME')
    if (lname) lname.setAttribute('name', 'LNAME')
    email.setAttribute('name', 'EMAIL')

    // Optionally override the label if a responseDiv is provided.
    if (settings.responseDiv) {
      const customLabel =
        typeof settings.responseDiv === 'string'
          ? document.querySelector(settings.responseDiv)
          : settings.responseDiv
      if (customLabel) {
        label = customLabel
        slideUp(label)
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      let msg = ''
      const now = Date.now()
      if (timer && now - timer < 5000) {
        msg = $t(6, '', settings.language)
        if (label) {
          label.innerHTML = msg
          slideDown(label)
        }
        if (typeof settings.callback === 'function') settings.callback()
        return false
      }
      timer = now

      if (button) {
        button.classList.add('loading')
        button.disabled = true
      }

      // Serialize the form data and add the language parameter.
      const formData = serializeForm(form)
      const finalUrl =
        url +
        (formData ? '&' : '') +
        formData +
        '&language=' +
        encodeURIComponent(settings.language)

      if (label) {
        label.innerHTML = $t(100, '', settings.language)
        slideDown(label)
      }

      // Create a unique callback function name.
      const callbackName =
        'jsonp_callback_' + Math.round(100000 * Math.random())
      const jsonpUrl = finalUrl.replace('c=callback', 'c=' + callbackName)

      jsonp(jsonpUrl, callbackName)
        .then((resp) => {
          if (button) {
            button.classList.remove('loading')
            button.disabled = false
          }
          if (resp.result === 'success') {
            msg = $t(resp.msg, '', settings.language)
            if (label) {
              label.innerHTML = msg
              label.classList.remove('error')
              label.classList.add('valid')
            }
            email.classList.remove('error')
            email.classList.add('valid')
            if (fname) {
              fname.classList.remove('error')
              fname.classList.add('valid')
            }
            if (lname) {
              lname.classList.remove('error')
              lname.classList.add('valid')
            }
            if (fnlabel) {
              fnlabel.classList.remove('error')
              fnlabel.classList.add('valid')
            }
            if (lnlabel) {
              lnlabel.classList.remove('error')
              lnlabel.classList.add('valid')
            }
            // Close widget after 4 seconds if applicable.
            setTimeout(() => {
              const widget = form.closest('.widget-newsletter')
              widget?.classList.remove('open')
            }, 4000)
          } else {
            email.classList.remove('valid')
            if (fname) fname.classList.remove('valid')
            if (lname) lname.classList.remove('valid')
            if (fnlabel) fnlabel.classList.remove('valid')
            if (lnlabel) lnlabel.classList.remove('valid')
            email.classList.add('error')
            fnlabel?.classList.add('error')
            lnlabel?.classList.add('error')
            label?.classList.add('error')

            const parts = resp.msg.split(' - ', 2)
            if (parts[1] === undefined) {
              msg = resp.msg
            } else {
              let variable = ''
              const i = parseInt(parts[0], 10)
              if (i.toString() === parts[0]) {
                const colonSplit = parts[1].split(': ', 2)
                if (colonSplit.length > 1) {
                  variable = colonSplit[1].split(')')[0]
                  msg = colonSplit[0] + ': {variable})'
                } else {
                  msg = parts[1]
                }
              } else {
                msg = resp.msg
              }
              msg = $t(msg, variable, settings.language)
            }
            if (label) {
              label.innerHTML = msg
              slideDown(label)
            }
          }
          if (typeof settings.callback === 'function') settings.callback(resp)
        })
        .catch((err) => {
          console.error('mailchimp ajax submit error:', err)
          if (button) {
            button.classList.remove('loading')
            button.disabled = false
          }
        })
      return false
    })
  }

  // Expose some properties/methods for external use.
  attach.responses = responses
  attach.translations = translations
  attach.init = (selector, options) => attach(selector, options)

  return attach
}

// Usage example:
// ajaxChimp.init('#form_id', { language: 'en', url: 'http://yourlist.us1.list-manage.com/subscribe/post?u=xxx&id=xxx' });
export default AjaxChimp
