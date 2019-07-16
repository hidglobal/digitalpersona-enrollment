<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@digitalpersona/enrollment](./enrollment.md) &gt; [PasswordEnroll](./enrollment.passwordenroll.md)

## PasswordEnroll class

Password enrollment API.

<b>Signature:</b>

```typescript
export declare class PasswordEnroll extends Enroller 
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(context)](./enrollment.passwordenroll.(constructor).md) |  | Constructs a new password enrollment API object. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [canEnroll()](./enrollment.passwordenroll.canenroll.md) |  | Reads a password change availability. |
|  [enroll(newPassword, oldPassword)](./enrollment.passwordenroll.enroll.md) |  | Changes a password. |
|  [randomize()](./enrollment.passwordenroll.randomize.md) |  | Creates a new strong password with good complexity properties. |
|  [reset(newPassword)](./enrollment.passwordenroll.reset.md) |  | Resets a password. |

## Remarks

As a primary credential, user's password cannot be unenroled, it can only be changed, reset or randomized.
