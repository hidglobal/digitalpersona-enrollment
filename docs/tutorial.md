---
layout: default
title: Tutorial
has_toc: false
nav_order: 2
---
{% include header.html %}

# Tutorial

## Getting started

### Add the package to your project

Using NPM:

```
npm install {{site.data.lib.package}}
```

Using Yarn:

```
yarn add {{site.data.lib.package}}
```

### Write some code

We recommend using Typescrypt or ES6 modules.
Import needed types from the {{ site.data.lib.package }} module,
for example:

```
import { BioSample, FingerPosition } from '@digitalpersona/core';
import { EnrollmentContext, FingerprintsEnroll } from '@digitalpersona/enrollment';

...
async submitFingerprints(context: EnrollmentContext, samples: BioSample[], pos: FingerPosition)
{
    try {
        const api = new FingerprintsEnroll(context);
        await api.enroll(pos, samples);
    }
    catch (error) {
        handleError(error);
    }
}
```

## Using Components

{% capture apiDocsBaseUrl %}{{site.data.lib.git}}/{{site.data.lib.repo}}/blob/master/dist/api/docs/enrollment{% endcapture%}

> For working examples see a ["Bank of DigitalPersona"](https://github.com/hidglobal/digitalpersona-sample-angularjs){:target="_blank" }
sample application.

### "What you know" authentication factors

* [PasswordEnroll]({{apiDocsBaseUrl}}.passwordenroll.md){:target="_blank" }
* [PinEnroll]({{apiDocsBaseUrl}}.pinenroll.md){:target="_blank" }
* [SecurityQuestionsEnroll]({{apiDocsBaseUrl}}.securityquestionsenroll.md){:target="_blank" }

### "What you are" authentication factors

* [FingerprintsEnroll](({{apiDocsBaseUrl}}.fingerprintsenroll.md)){:target="_blank" }
* [FaceEnroll](({{apiDocsBaseUrl}}.faceenroll.md)){:target="_blank" }

### "What you have" authentication factors

* [SmartCardEnroll](({{apiDocsBaseUrl}}.smartcardenroll.md)){:target="_blank" }
* [ContactlessCardEnroll](({{apiDocsBaseUrl}}.contactlesscardenroll.md)){:target="_blank" }
* [ProximityCardEnroll](({{apiDocsBaseUrl}}.proximitycardenroll.md)){:target="_blank" }
* [U2FEnroll](({{apiDocsBaseUrl}}.u2fenroll.md)){:target="_blank" }
* [TimeOtpEnroll](({{apiDocsBaseUrl}}.timeotpenroll.md)){:target="_blank" }


