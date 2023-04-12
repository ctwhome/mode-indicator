<script lang="ts">
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
	let stress =''
	let textarea
	let modes = [];
	onMount(async () => {
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
			    stress
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
		<label on:click={()=>modal = true} class="btn ml-10" > <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Add new feeling</label>
	</div>

<!-- The button to open modal -->


<!-- Put this part before </body> tag -->
<input type="checkbox" bind:checked={modal}  class="modal-toggle" />
<div class="modal">
  <div class="modal-box bg-base-200">
    <h3 class="font-bold text-lg">How do you feel</h3>

		<div class="opacity-60">Stress level</div>
		<div class="flex gap-4">
			<button class={`btn btn-circle bg-purple-500 hover:bg-purple-600 borner-none border-gray-300 ${stress ==='purple' && 'border-8'}`} on:click={()=>{stress='purple', textarea.focus()}}></button>
			<button class={`btn btn-circle bg-yellow-400 hover:bg-yellow-600 borner-none border-gray-300 ${stress ==='yellow' && 'border-8'}`} on:click={()=>{stress='yellow', textarea.focus()}}></button>
			<button class={`btn btn-circle bg-green-400 hover:bg-green-600 borner-none border-gray-300 ${stress ==='green' && 'border-8'}`} on:click={()=>{stress='green', textarea.focus()}}></button>
		</div>


		<br>
		Comment <br><textarea bind:this={textarea} class="textarea rounded-lg w-full max-w-xs" on:keydown={(event)=> event.key === "Enter" && (addFeeling(), modal=false)  } bind:value={comment} />

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
				<div class={`${!mode.comment && 'opacity-50 italic'} text-[1rem]`}>{mode.comment || "no comment"}</div>
				<div class="text-sm">{ mode.date?.toDate().getDate() } { mode.date?.toDate().toLocaleString('default', { month: 'long' })}, { day[mode.date?.toDate().getDay()]}
					om
					{ mode.date?.toDate().getHours()}:{String(mode.date?.toDate().getMinutes()).padStart(2, "0")} <button on:click={()=>deleteFeeling(mode.id)}><span class="ml-4">🗑️</span></button></div>
			</div>
		</li>
  {/each}
</ul>
</div>
