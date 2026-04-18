#!/usr/bin/env node
/**
 * Migration script: move rules/ and history/ markdown files into
 * {collection}/fr/{english-slug-path}.md structure for i18n support.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Directory segment mapping (French → English) ───────────────────────
const dirMap = {
  fondamentaux: 'fundamentals',
  arcanotechnie: 'arcanotechnology',
  ecoles: 'schools',
  combat: 'combat',
  reference: 'reference',
  creation_personnage: 'character_creation',
  introduction_narrative: 'narrative_introduction',
  chronologie: 'timeline',
  contexte: 'context',
  militaire: 'military',
  politique: 'politics',
  social: 'social',
  histoire: 'history',
  systemes: 'systems',
};

// ─── Filename mapping (French stem → English stem, without .md) ─────────
const fileMap = {
  // index stays as index
  index: 'index',

  // rules/fondamentaux
  introduction: 'introduction',
  bases_des_regles: 'rules_basics',

  // rules/arcanotechnie
  systeme_de_flux: 'flux_system',
  affinites_et_types: 'affinities_and_types',

  // rules/arcanotechnie/ecoles
  aerocinetique_conversion_atmospherique: 'aerokinetic_atmospheric_conversion',
  balistique_techniques_de_combat_a_distance: 'ballistic_ranged_combat_techniques',
  bioarcanotechnie_conversion_biologique: 'bioarcanotechnology_biological_conversion',
  biometabolique_conversion_bioenergetique: 'biometabolic_bioenergetic_conversion',
  chronodynamique_conversion_temporelle: 'chronodynamic_temporal_conversion',
  electricite_conversion_electromagnetique: 'electricity_electromagnetic_conversion',
  feu_conversion_thermique_rapide: 'fire_rapid_thermal_conversion',
  givre_extraction_energetique: 'frost_energy_extraction',
  gravitonique_conversion_gravitationnelle: 'gravitonic_gravitational_conversion',
  hydrodynamique_conversion_fluide: 'hydrodynamic_fluid_conversion',
  illusion_manipulation_de_la_perception: 'illusion_cognitive_manipulation',
  kinesthesique_conversion_gravito_mecanique: 'kinesthetic_gravito_mechanical_conversion',
  lumiere_conversion_photonique_stabilisee: 'light_stabilized_photonic_conversion',
  magnetique_conversion_magnetique: 'magnetic_magnetic_conversion',
  martial_techniques_de_combat_physique: 'martial_physical_combat_techniques',
  ombre_manipulation_de_l_information: 'shadow_photonic_absorption',
  pure_manipulation_du_flux_arcanotechnique: 'pure_arcanotechnic_flux_manipulation',
  quantique_manipulation_quantique: 'quantum_quantum_manipulation',
  sonique_conversion_vibratoire: 'sonic_vibratory_conversion',

  // rules/combat
  philosophie_du_systeme: 'system_philosophy',
  jet_de_des: 'dice_roll',
  initiative: 'initiative',
  deroulement_du_combat: 'combat_flow',
  attaquer: 'attacking',
  man_uvres: 'maneuvers',
  jets_d_opportunite: 'opportunity_rolls',
  defense_et_resistances: 'defense_and_resistances',
  actions_defensives_actives: 'active_defensive_actions',
  deplacement: 'movement',
  rythme_et_duree: 'rhythm_and_duration',
  fin_du_combat: 'end_of_combat',

  // rules/reference
  comment_contribuer: 'how_to_contribute',
  histoire: 'history',
  lexique: 'glossary',
  resistances: 'resistances',

  // rules/reference/creation_personnage
  vue_d_ensemble_du_systeme: 'system_overview',
  cout_des_statistiques_de_personnage: 'character_stats_cost',
  cout_des_statistiques_de_base_pv_et_vitesse: 'base_stats_hp_and_speed_cost',
  cout_des_affinites: 'affinities_cost',
  cout_du_systeme_de_flux: 'flux_system_cost',
  cout_de_l_equipement: 'equipment_cost',
  cout_des_competences: 'skills_cost',
  cout_des_resistances_innees: 'innate_resistances_cost',
  conseils_de_construction: 'building_tips',
  exemple_complet_creation_d_un_mage_de_glace: 'complete_example_ice_mage',
  validation_avec_le_mj: 'gm_validation',
  progression_et_experience: 'progression_and_experience',

  // history/introduction_narrative
  guide_citoyen: 'citizen_guide',
  jour_dans_empire: 'day_in_the_empire',

  // history/arcanotechnie/ecoles
  classification_des_modes_de_conversion: 'conversion_modes_classification',
  les_ecoles_biologiques: 'biological_schools',
  les_ecoles_cinetiques: 'kinetic_schools',
  les_ecoles_elementaires: 'elemental_schools',
  les_ecoles_martiales_et_pures: 'martial_and_pure_schools',
  les_ecoles_scientifiques_avancees: 'advanced_scientific_schools',

  // history/arcanotechnie/fondamentaux
  nature_fondamentale_de_l_arcanotechnie: 'fundamental_nature_of_arcanotechnology',
  revolution_arcanotechnique: 'arcanotechnic_revolution',
  voyage_interstellaire: 'interstellar_travel',
  communication_arcanotechnique: 'arcanotechnic_communication',
  applications_industrielles: 'industrial_applications',

  // history/arcanotechnie/histoire
  l_origine_cosmologique_du_flux: 'cosmological_origin_of_flux',
  la_decouverte_du_primique: 'discovery_of_primics',
  le_mecanisme_de_couplage_electron_flux: 'electron_flux_coupling_mechanism',

  // history/arcanotechnie/systemes
  les_cristaux_de_mana: 'flux_crystals',
  interface_directe_arcanotechniciens_et_cristaux: 'direct_interface_arcanotechnicians_and_crystals',
  les_systemes_arcanotechniques_automatises: 'automated_arcanotechnic_systems',
  // applications_industrielles already mapped above
  applications_militaires_critiques: 'critical_military_applications',
  infrastructure_civile_essentielle: 'essential_civilian_infrastructure',
  l_arcanotechnie_dans_la_societe_moderne: 'arcanotechnology_in_modern_society',
  implications_tactiques_et_strategiques: 'tactical_and_strategic_implications',
  limitations_physiques_et_pratiques: 'physical_and_practical_limitations',
  l_avenir_de_l_arcanotechnie: 'future_of_arcanotechnology',

  // history/chronologie
  resume_historique: 'historical_summary',

  // history/contexte
  economique: 'economic',

  // history/contexte/militaire
  structure_de_l_armee: 'army_structure',
  categories_d_unites: 'unit_categories',
  mobilisation_en_temps_de_guerre_5755: 'wartime_mobilization_5755',
  unites_d_elite_remarquables: 'notable_elite_units',
  unites_secretes: 'secret_units',

  // history/contexte/politique
  structure_gouvernementale: 'governmental_structure',
  structure_politique: 'political_structure',
  le_conseil_des_gardiens: 'council_of_guardians',
  l_assemblee_imperiale: 'imperial_assembly',
  gestion_de_l_opposition_et_de_la_dissidence: 'opposition_and_dissent_management',

  // history/contexte/social
  normes_sociales: 'social_norms',
  education: 'education',
  divertissement_et_culture: 'entertainment_and_culture',
  guerre_et_societe: 'war_and_society',
};

// ─── Translation helpers ────────────────────────────────────────────────

function translateSegment(segment) {
  return dirMap[segment] || fileMap[segment] || segment;
}

function translatePath(relPath) {
  const parts = relPath.split('/');
  const filename = parts.pop();
  const stem = filename.replace(/\.md$/, '');
  const enStem = fileMap[stem];
  if (!enStem && stem !== 'index') {
    console.warn(`  ⚠ No mapping for filename: ${stem} (in ${relPath})`);
  }
  const enFilename = (enStem || stem) + '.md';
  const enDirs = parts.map(p => {
    const en = dirMap[p];
    if (!en) console.warn(`  ⚠ No mapping for directory: ${p} (in ${relPath})`);
    return en || p;
  });
  return [...enDirs, enFilename].join('/');
}

// ─── Find all .md files recursively ─────────────────────────────────────

function findMdFiles(dir) {
  const results = [];
  function walk(current, rel) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), entryRel);
      } else if (entry.name.endsWith('.md')) {
        results.push(entryRel);
      }
    }
  }
  walk(dir, '');
  return results;
}

// ─── Remove empty directories recursively (bottom-up) ──────────────────

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      removeEmptyDirs(path.join(dir, entry.name));
    }
  }
  // Check again after cleaning children
  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) {
    fs.rmdirSync(dir);
  }
}

// ─── Main migration ─────────────────────────────────────────────────────

function migrateCollection(name, collectionDir) {
  console.log(`\n═══ Migrating ${name} ═══`);

  // Skip the fr/ and en/ dirs if they already exist (re-run safety)
  const frDir = path.join(collectionDir, 'fr');
  if (fs.existsSync(frDir)) {
    console.log(`  ℹ ${name}/fr/ already exists - skipping`);
    return;
  }

  const mdFiles = findMdFiles(collectionDir);
  console.log(`  Found ${mdFiles.length} .md files`);

  let moved = 0;
  for (const relPath of mdFiles) {
    const enPath = translatePath(relPath);
    const src = path.join(collectionDir, relPath);
    const dst = path.join(frDir, enPath);

    // Create target directory
    fs.mkdirSync(path.dirname(dst), { recursive: true });

    // Move file
    fs.renameSync(src, dst);
    if (relPath !== enPath) {
      console.log(`  ${relPath} → fr/${enPath}`);
    } else {
      console.log(`  ${relPath} → fr/${enPath} (unchanged)`);
    }
    moved++;
  }

  // Clean up empty directories left behind
  removeEmptyDirs(collectionDir);

  console.log(`  ✓ Moved ${moved} files`);
}

// ─── Run ─────────────────────────────────────────────────────────────────

migrateCollection('rules', path.join(ROOT, 'rules'));
migrateCollection('history', path.join(ROOT, 'history'));

console.log('\n✓ Migration complete');
