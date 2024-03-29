<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/enrollment](./enrollment.md) &gt; [TimeOtpEnroll](./enrollment.timeotpenroll.md)

## TimeOtpEnroll class

One-time password enrollment API.

<b>Signature:</b>

```typescript
export declare class TimeOtpEnroll extends Enroller 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(context)](./enrollment.timeotpenroll.(constructor).md) |  | Constructs a new One-Time Password enrollment API object. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [createKeyUri(key)](./enrollment.timeotpenroll.createkeyuri.md) |  | Converts a secret key to a Key URI, which will be encode as a QR Code image to scan. |
|  [enrollHardwareOtp(code, serialNumber, counter, timer)](./enrollment.timeotpenroll.enrollhardwareotp.md) |  | Enrolls a hardware TOTP token. |
|  [enrollSoftwareOtp(code, key, phoneNumber)](./enrollment.timeotpenroll.enrollsoftwareotp.md) |  | Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.) |
|  [sendVerificationCode(key, phoneNumber)](./enrollment.timeotpenroll.sendverificationcode.md) |  | Sends an verification code using SMS to the user's device. |
|  [unenroll()](./enrollment.timeotpenroll.unenroll.md) |  | Deletes the OTP enrollment. |

