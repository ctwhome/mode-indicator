<script lang="ts">
	import Logo from '$lib/header/Logo.svelte';
	import SocialIcons from '$lib/SocialIcons.svelte';
	import AppFooter from '$lib/AppFooter.svelte';
	import LoginButton from '$lib/Login/LoginButton.svelte';
	import DaisyuiThemeSwitcher from '../DaisyuiThemeSwitcher.svelte';

	const [{ metadata }] = Object.values(import.meta.globEager('$content/menu-items.md'));
</script>

<div class="drawer">
	<label for="my-drawer-3" />
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<!--    Drawer side-->
	<div class="drawer-side ">
		<label for="my-drawer-3" class="drawer-overlay z-10" />
		<!-- Sidebar content here -->
		<ul class="menu p-4 overflow-y-auto w-80 bg-base-100">
			<div class="mb-10">
				<Logo />
			</div>
			<!-- Sidebar content here -->
			<ul>
				{#each metadata.menu as menu}
					<li>
						<a
							class="text-lg text-content"
							data-sveltekit-prefetch
							href={menu.url}
							on:click={() => {
								document.getElementById('my-drawer-3').click();
							}}
						>
							{menu.name}
						</a>
					</li>
				{/each}
			</ul>
			<div class="mt-6">
				<SocialIcons />
			</div>
		</ul>
	</div>
	<div class="drawer-content flex flex-col ">
		<!-- Navbar -->
		<div
			class=" lg:sticky lg:top-0 z-10 bg-base-100 saturate-[180%] bg-opacity-80 backdrop-blur-md"
		>
			<div class="px-3 py-6 flex justify-between items-center h-[80px] container mx-auto ">
				<div class="flex sm:hidden">
					<!-- Open Menu icon-->
					<label for="my-drawer-3" class="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-6 h-6 stroke-current text-content"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</label>

					<Logo />
				</div>

				<div class="hidden w-full sm:flex justify-between items-center">
					<Logo />
					<ul class="menu menu-horizontal gap-3">
						<!-- Navbar menu content here -->
						{#each metadata.menu as menu}
							<li>
								<a class="text-lg font-medium text-content" href={menu.url} data-sveltekit-prefetch>
									{menu.name}
								</a>
							</li>
						{/each}
					</ul>
					<SocialIcons />
					<DaisyuiThemeSwitcher />
					<LoginButton />
				</div>
			</div>
		</div>
		<!-- Page content here -->
		<div class="flex-1">
			<slot />
		</div>
	</div>
</div>
