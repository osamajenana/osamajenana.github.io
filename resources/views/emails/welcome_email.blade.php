@component('mail::message')
# Welcome

The body of your message.

@component('mail::button', ['url' => ''])
open Muscat Apps
@endcomponent

Thanks,<br>
{{-- {{ config('app.name') }} --}}
@endcomponent
