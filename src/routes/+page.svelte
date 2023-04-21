<script lang="ts">
	import { page } from '$app/stores'

	import { onMount } from "svelte";
	import { db } from "../lib/firebase";
	import { collection, getDocs,addDoc, deleteDoc, doc, Timestamp, orderBy, query } from "firebase/firestore";



	const day = [
		'Zondag',
'Maandag',
'Dinsdag',
'Woensdag',
'Donderdag',
'Vrijdag',
'Zaterdag',
	]
	let modal = false

	let comment =''
	let stress ='purple'
	let tick = false
	let touched = false
	let textarea
	let modes = [];
	onMount(async () => {

		// Open the modal directly to add a new feeling
		$page.url.searchParams.has('open') && (modal = true)

		const querySnapshot = await getDocs(query(collection(db, "modes"),orderBy("date", "desc")));
		querySnapshot.forEach((doc) => {
			modes.push({id:doc.id,...doc.data()});
		});
		modes = modes
		});

		async function addFeeling() {
			const newMode ={
			    date: Timestamp.now(),
			    comment,
			    stress,
					tick,
					touched
			  }

			try {
			  const docRef = await addDoc(collection(db, "modes"), newMode);
				newMode['id'] = docRef.id
				modes.unshift(newMode)
				modes = modes
				resetForm()
			} catch (e) {
			  console.error("Error adding document: ", e);
			}
		}

		async function deleteFeeling(id){
			await deleteDoc(doc(db, "modes", id));
			modes = modes.filter((mode)=>mode.id !== id)
		}

		function resetForm() {
			comment =''
			stress =''
			tick = false
			touched = false
		}
</script>

<svelte:head>
	<title>Mode App</title>
</svelte:head>

<div class="container mx-auto prose-xl relative">


	<div class="prose bg-base-300 rounded p-4 mt-4">
		<strong>Groen</strong>: zin hebben, gefocust zijn, relativeren, lage ademhaling, stabiel, contact maken, positief reageren
		<br>
		<strong>Geel</strong>: minder overzicht hebben, snel willen afhandelen, hoge ademhaling, geïrriteerd, kortaf reageren, lijstjes maken, klagen
		<br>
		<strong>Paars:</strong> sussen, moeten, slecht slapen, angstgevoel, gejaagd zijn, activiteiten afzeggen, te moe zijn voor sport
	</div>


	<div class="flex mt-10 flex-wrap">
		<div class="text-3xl ">How do I feel ({modes.length})</div>
		<label on:click={()=>modal = true} class="btn ml-10" >New feeling <svg xmlns="http://www.w3.org/2000/svg" class="ml-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></label>
	</div>

<!-- The button to open modal -->


<!-- Put this part before </body> tag -->

<input type="checkbox" bind:checked={modal}  class="modal-toggle" />
<div class="modal">
  <div class="modal-box bg-base-200">
    <h3 class="font-bold text-lg">How do you feel</h3>

		<div class="opacity-60 text-sm mb-4">Color level</div>
		<div class="flex gap-4">
			<button class={`btn btn-circle bg-purple-500 hover:bg-purple-600 borner-none border-gray-300 ${stress ==='purple' && 'border-8'}`} on:click={()=>{stress='purple', textarea.focus()}}></button>
			<button class={`btn btn-circle bg-yellow-400 hover:bg-yellow-600 borner-none border-gray-300 ${stress ==='yellow' && 'border-8'}`} on:click={()=>{stress='yellow', textarea.focus()}}></button>
			<button class={`btn btn-circle bg-green-400 hover:bg-green-600 borner-none border-gray-300 ${stress ==='green' && 'border-8'}`} on:click={()=>{stress='green', textarea.focus()}}></button>
			<div class="flex-1"></div>


		</div>
		<div class="opacity-60 text-sm my-4">Tick (Intention - Touched)</div>
		<div class="flex gap-4 mt-4">

			<!-- Tick button -->
			<button class={`btn btn-circle -rotate-45 ${tick ===true ? 'border-4 bg-orange-500':'bg-orange-300'}  hover:bg-orange-600 borner-none border-gray-300 `} on:click={()=>{tick = !tick, textarea.focus(), touched=false}}>
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12m0-.5v-2a1.5 1.5 0 1 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12"></path><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7A69.74 69.74 0 0 1 7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.867 1.867 0 0 1 2.28.28L8 13"></path></g></svg>
			</button>

			<!-- touched button -->
			<button class={`btn btn-circle ${touched ===true ? 'border-4 bg-red-500':'bg-red-300'}  hover:bg-red-600 borner-none border-gray-300 `} on:click={()=>{touched = !touched, textarea.focus(), tick=false}}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 22q-1.55 0-2.538-.775T12.95 18.95q-.425-1.25-.812-1.75t-1.788-1.6Q8.8 14.35 7.9 12.775T7 9q0-2.975 2.013-4.987T14 2q2.975 0 4.988 2.013T21 9h-2q0-2.125-1.438-3.563T14 4q-2.125 0-3.563 1.438T9 9q0 1.7.675 2.9t1.925 2.15q1.3.95 2.025 1.85t1.075 1.95q.35 1.1.838 1.625T17 20q.825 0 1.413-.588T19 18h2q0 1.65-1.175 2.825T17 22ZM6.2 16.75q-1.475-1.5-2.338-3.488T3 9q0-2.3.863-4.3T6.2 1.2l1.45 1.4Q6.4 3.85 5.7 5.488T5 9q0 1.85.7 3.475t1.95 2.875l-1.45 1.4ZM14 11.5q-1.05 0-1.775-.738T11.5 9q0-1.05.725-1.775T14 6.5q1.05 0 1.775.725T16.5 9q0 1.025-.725 1.763T14 11.5Z"/></svg>
			</button>

		</div>

		<div class="opacity-60 text-sm my-3">Comment</div>

		<textarea bind:this={textarea} class="textarea rounded-lg w-full max-w-xs" on:keydown={(event)=> event.key === "Enter" && (addFeeling(), modal=false)  } bind:value={comment} />

    <div class="modal-action gap-10">
			<button on:click={()=>modal = false} class="btn btn-ghost" on:click={resetForm}>Cancel</button>
			<button on:click={()=>modal = false} class="btn" on:click={addFeeling}>Add</button>
    </div>
  </div>
</div>


	<ul>
  	{#each modes as mode}
    <li class="flex gap-2 align-center text-md hover:bg-base-100 rounded">
			<div class={`-translate-y-4 circle ${mode.stress === 'purple' && 'bg-purple-500'} ${mode.stress === 'yellow' && 'bg-yellow-500'} ${mode.stress === 'green' && 'bg-green-500'} w-10 h-10 rounded-xl`}></div>
			<div>
				<div class="flex gap-3 items-center">

					{#if (mode.tick)}
					<span class={`flex items-center justify-center rounded-full w-5 h-5 text-white bg-orange-500 borner-none -rotate-45`}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor"><path d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12m0-.5v-2a1.5 1.5 0 1 1 3 0V12m0-1.5a1.5 1.5 0 0 1 3 0V12"></path><path d="M17 11.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7A69.74 69.74 0 0 1 7 19c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.867 1.867 0 0 1 2.28.28L8 13"></path></g></svg>

					</span>
					{/if}

					{#if (mode.touched)}
					<span class={`flex items-center justify-center rounded-full w-5 h-5 text-white bg-red-600 borner-none`} >
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M17 22q-1.55 0-2.538-.775T12.95 18.95q-.425-1.25-.812-1.75t-1.788-1.6Q8.8 14.35 7.9 12.775T7 9q0-2.975 2.013-4.987T14 2q2.975 0 4.988 2.013T21 9h-2q0-2.125-1.438-3.563T14 4q-2.125 0-3.563 1.438T9 9q0 1.7.675 2.9t1.925 2.15q1.3.95 2.025 1.85t1.075 1.95q.35 1.1.838 1.625T17 20q.825 0 1.413-.588T19 18h2q0 1.65-1.175 2.825T17 22ZM6.2 16.75q-1.475-1.5-2.338-3.488T3 9q0-2.3.863-4.3T6.2 1.2l1.45 1.4Q6.4 3.85 5.7 5.488T5 9q0 1.85.7 3.475t1.95 2.875l-1.45 1.4ZM14 11.5q-1.05 0-1.775-.738T11.5 9q0-1.05.725-1.775T14 6.5q1.05 0 1.775.725T16.5 9q0 1.025-.725 1.763T14 11.5Z"/></svg>

					</span>
					{/if}
					<div class={`${!mode.comment && 'opacity-50 italic'} text-[1rem]`}>{mode.comment || "no comment"}</div>
				</div>
				<div class="text-sm">{ mode.date?.toDate().getDate() } { mode.date?.toDate().toLocaleString('default', { month: 'long' })}, { day[mode.date?.toDate().getDay()]}
					om

					{ mode.date?.toDate().getHours()}:{String(mode.date?.toDate().getMinutes()).padStart(2, "0")}

					<button on:click={()=>deleteFeeling(mode.id)}><span class="ml-4">🗑️</span></button>


				</div>


			</div>
		</li>
  {/each}
</ul>
</div>
