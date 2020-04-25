Maybe you’ll read that title and think:

Damn, Chris. Little dogmatic isn’t it? There are lots of ways to do things, especially on the web. Why be all prescriptive?

You’d be right. What I actually want is for everyone creating content on the web to create that content in a clean way that will serve them long into the future. Markdown, I feel, highly encourages that.

Let us explore some of those ways.

If you have no idea what Markdown is, it’s a “text-to-HTML conversion tool for web writers”. It’s root is here and there are many implementations.

## It keeps dangerous cruft out of your content

This is #1 for a reason. I overflow with sadness when I hear of someone dealing with legacy content that is full of ancient markup.

I bet you know what I mean.

Things like <span style="font-weight: bold; font-family: Georgia; color: red;"> around seemingly random sentences. <div class="content-wrap-wrap"> wrapping every single blog post because it was just “what you did”. Images force-floated to the right because that made sense three designs ago. Headers with class names on them that don’t even exist anymore. Tables of data spit into content with all the whitespace stripped out and weird alignment attributes you barely recognize. An about page that was pasted in from Microsoft Word.

Content like this will not and cannot last.

A frustrated person in the future might just delete it. Someone might be forced to clean it up in the future, become even more frustrated, and do a bad job of it.

It discourages and delays more important work.

To be fair, most Markdown implementations allow HTML, so you could junk up content system that supports Markdown too. But, the support of Markdown highly encourages using it exclusively. Plus you could make it a rule in your organization.

The point is: when you blog in Markdown, you’re writing in a clean language that translates to very clean HTML. Just your standard <p>s, <ul>s, <ol>s, <blockquotes>s and the like. Good ol’ semantic and accessible content.

## It encourages structured data

Say one of types of pages on your website needs to have a hero image at the top. Another one needs a thumbnail gallery of images. What then? There is no Markdown standard for these kind of things. Aren’t we then forced into some kind of <div class="hero-banner"> or <div class="thumbnail-gallery"> situation?

I’d say no. I’ve long said that the right CMS is a customized one.

What I mean is that your CMS should be helping you here. You need a new page type that your CMS knows about that allows you to store data that accommodates the needs of that type of page. The thumbnail gallery shouldn’t be inside the “chunk of content”, but rather in some kind of organized custom field area that can be accessed and used by the templates.

## It can be compiled to other formats

I don’t really see HTML going anywhere on the web anytime soon. It’s been the most constant tech on the web for as long as I’ve known.

Still, perhaps it will change one day. If it does, you’re in luck. If you’ve been working in Markdown, you’ve been working in an abstracted language all along. Markdown typically converts into HTML but there is no reason it can’t convert into something else instead.

Plus, think of all the custom formats out there. I’ve been looking at Apple News lately. To publish to Apple News, your content needs to be in a special JSON format, and the content inside that expects (you guessed it) Markdown. If it needed something else, you can bet there would be a converter available.

## It encourages keeping the site fresh

You can easily gather enthusiasm for a site redesign (or freshening up) when the infrastructure for the site and its content is sound. A project could become “let’s update our typography system to accommodate the new branding and address the widening spectrum of devices” rather than “ughck we need to clean up a decade of inline styles before we can create a type system that actually properly applies itself to our content.”

## It feels good to write in

Once you’re used to it, it feels very natural. Far less awkward than reaching for those angle bracket keys. I particularly like the link format, where you can write out the text you want to be linked first (within the square brackets) before you need to stop your brain for a second to go copy/paste the link.
Right then.

I’ll bet you a nickel you don’t regret it.

If you end up not going with Markdown, I’d still highly encourage very clean HTML markup, or something else with the same kind of advantages I describe here.
